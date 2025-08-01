import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloud } from "../../../config/cloudinary/deleteImageFromCloud";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { ePaymentStatus, iReqQueryParams } from "../../global-interfaces";
import { QueryBuilder } from "../../lib/queryBuilder";
import { transactionRollback } from "../../lib/transactionRollback";
import { generateTrackingID, generateTrxID } from "../../utils/idGenerator";
import { mongoIdValidator } from "../../utils/mongoIdValidator";
import { Payment } from "../payment/payment.model";
import { iSSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { eUserRoles } from "../user/user.interface";
import { parcelSearchFields } from "./parcel.constant";
import { eParcelStatus, eParcelTypes, iParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

export const createdParcelService = async (req: Request) => {
  const rates = { Document: 40, Box: 60, Fragile: 50, Other: 80 };
  const decoded = req.decoded as JwtPayload;
  const payload = req.body;

  if (!payload.type || !payload.weight) {
    throw new AppError(sCode.BAD_REQUEST, "Parcel type and weight is required");
  }

  const type = Object.keys(rates).find(
    (rate) => rate === payload.type
  ) as eParcelTypes;

  if (!decoded.phone || !decoded.address) {
    throw new AppError(
      sCode.BAD_REQUEST,
      "Updated your profile with phone number and address"
    );
  }

  payload.rent = rates[type] * payload.weight;
  payload.trackingId = generateTrackingID();
  payload.sender = decoded._id;
  payload.estimatedDeliveryDate = new Date(
    Date.now() + 3 * 24 * 60 * 60 * 1000
  );

  return await transactionRollback(async (session) => {
    const parcel = new Parcel(payload);
    await parcel.save({ session });

    const payment = new Payment({
      parcel: parcel._id,
      TrxID: generateTrxID(),
      rent: parcel.rent,
      status: ePaymentStatus.UNPAID,
    });
    await payment.save({ session });

    const {
      street,
      city,
      stateOrProvince: state,
      postalCode: post,
      country,
    } = decoded.address;

    const sslPayload = {
      rent: payment.rent,
      TrxID: payment.TrxID,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
      address: `${street}, ${city}, ${state}, ${post}, ${country}`,
    } as iSSLCommerz;

    const sslPayment = await sslPaymentInit(sslPayload);

    return {
      data: { parcel, payment },
      meta: { options: { paymentURL: sslPayment?.GatewayPageURL } },
    };
  });
};

//
export const updateParcelService = async (req: Request) => {
  const id = mongoIdValidator(req.params?.parcelId || "");
  const payload = req.body as Partial<iParcel>;
  const { role } = req.decoded as JwtPayload;
  const { SENDER, RECEIVER, MODERATOR } = eUserRoles;

  if ("trackingId" in payload) delete payload.trackingId;
  if ("status" in payload) delete payload.status;
  if ("statusLogs" in payload) delete payload.statusLogs;

  const forbiddenFields = [
    "rent",
    "isBlocked",
    "isCancelled",
    "estimatedDeliveryDate",
    "deliveredAt",
  ];
  if (role === SENDER || role === RECEIVER) {
    const hasForbiddenField = forbiddenFields.some((field) => field in payload);
    if (hasForbiddenField) {
      throw new AppError(
        sCode.FORBIDDEN,
        "You're not allowed to update these fields:  rent, isBlocked, isCancelled, estimatedDeliveryDate, deliveredAt"
      );
    }
  }

  if ("rent" in payload && role === MODERATOR) {
    throw new AppError(
      sCode.FORBIDDEN,
      "You're not allowed to update the rent"
    );
  }

  return await transactionRollback(async (session) => {
    const oldParcel = await Parcel.findById(id)
      .select("images")
      .session(session);
    if (!oldParcel) throw new AppError(404, "Parcel not found");

    const oldImages = oldParcel.images || [];
    const delImg = payload.deletedImages || [];
    const images = payload.images || [];

    const remainingImages = oldImages.filter((img) => !delImg.includes(img));
    payload.images = [...images, ...remainingImages];

    const updatedParcel = await Parcel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    if (!updatedParcel) throw new AppError(404, "Parcel not found");

    if (delImg.length > 0) {
      await Promise.all(delImg.map((url) => deleteImageFromCloud(url)));
    }

    return { data: updatedParcel };
  });
};

//
export const updateParcelStatusService = async (req: Request) => {
  const parcelId: string = req.params.parcelId;
  const { status, note } = req.body;

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  parcel.statusLogs.push({
    status: status,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(req.decoded?._id),
    note: note || `Status updated from ${parcel.status}`,
  });

  parcel.status = status;

  await parcel.save();
  return { data: parcel };
};

//
export const cancelParcelService = async (req: Request) => {
  const parcelId: string = req.params.parcelId;
  const { note } = req.body;

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  if (parcel.status === eParcelStatus.Dispatched)
    throw new AppError(sCode.BAD_REQUEST, "Parcel already dispatched");

  parcel.statusLogs.push({
    status: eParcelStatus.Cancelled,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(req.decoded?._id),
    note: note || `Status updated from ${parcel.status}`,
  });

  parcel.status = eParcelStatus.Cancelled;

  await parcel.save();
  return { data: parcel };
};

//
export const confirmParcelService = async (req: Request) => {
  const parcelId: string = req.params.parcelId;
  const { note } = req.body;

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  if (parcel.status === eParcelStatus.Dispatched)
    throw new AppError(sCode.BAD_REQUEST, "Parcel already dispatched");

  parcel.statusLogs.push({
    status: eParcelStatus.Dispatched,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(req.decoded?._id),
    note: note || `Status updated from ${parcel.status}`,
  });

  parcel.status = eParcelStatus.Dispatched;

  await parcel.save();
  return { data: parcel };
};

//
export const updateParcelStatusLogsService = async (req: Request) => {
  const parcelId = req.params.parcelId;
  const { note, status, updatedAt } = req.body;

  if (!parcelId || !status || !updatedAt) {
    throw new AppError(400, "Parcel ID, status, and updatedAt are required");
  }

  const result = await Parcel.updateOne(
    { _id: parcelId },
    {
      $set: {
        "statusLogs.$[log].note": note,
        "statusLogs.$[log].updatedAt": new Date(),
      },
    },
    {
      arrayFilters: [
        {
          "log.status": status,
          "log.updatedAt": new Date(updatedAt),
        },
      ],
    }
  );

  if (result.modifiedCount === 0) {
    throw new AppError(404, "No matching status log found to update");
  }

  return {
    data: result,
  };
};

//
export const getAllParcelService = async (query: iReqQueryParams) => {
  const queryBuilder = new QueryBuilder(Parcel, query);

  const [tours, meta] = await Promise.all([
    queryBuilder
      .search(parcelSearchFields)
      .filter()
      .sort()
      .select()
      .paginate()
      .build(),
    queryBuilder.meta(parcelSearchFields),
  ]);

  return {
    data: tours,
    meta,
  };
};

//
export const getSingleParcelService = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId });
  if (!parcel)
    throw new AppError(sCode.NOT_FOUND, "Parcel not found with this ID");
  return { data: parcel };
};

//
export const getMyParcelService = async (id: string) => {
  const parcels = await Parcel.find({ sender: mongoIdValidator(id) });
  if (!parcels)
    throw new AppError(sCode.NOT_FOUND, "Parcel not found with this ID");
  return { data: parcels };
};

//
export const incomingParcelService = async (id: string) => {
  const parcels = await Parcel.find({ receiver: mongoIdValidator(id) });
  if (!parcels)
    throw new AppError(sCode.NOT_FOUND, "Parcel not found with this ID");
  return { data: parcels };
};

//
export const deleteStatusLogService = async (req: Request) => {
  const { _id, role } = req.decoded as JwtPayload;
  const parcelId = req.params?.parcelId || "";
  const { deletedStatus, presentStatus, note, updatedAt } = req.body;
  const { SENDER, RECEIVER, MODERATOR } = eUserRoles;
  const restrictedStatuses = [eParcelStatus.Delivered, eParcelStatus.Received];

  if (role === RECEIVER || role === SENDER || role === MODERATOR) {
    if (restrictedStatuses.includes(deletedStatus)) {
      throw new AppError(400, "Your are not permitted to delete this status");
    }
  }

  const parcel = await Parcel.findById(mongoIdValidator(parcelId));
  if (!parcel) throw new AppError(404, "Parcel not found");

  const newStatusLogs = parcel.statusLogs.filter(
    (log) =>
      !(
        log.status === deletedStatus &&
        new Date(log.updatedAt).getTime() === new Date(updatedAt).getTime()
      )
  );

  if (newStatusLogs.length === 0) {
    throw new AppError(400, "Cannot delete status log");
  }

  parcel.statusLogs = newStatusLogs;

  parcel.statusLogs.push({
    status: presentStatus,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(_id),
    note: note || `Status updated to ${presentStatus}`,
  });

  parcel.status = presentStatus;

  await parcel.save();

  return {
    data: {
      message: "Status log deleted and new status added",
      currentStatus: parcel.status,
      totalLogs: parcel.statusLogs.length,
    },
  };
};
