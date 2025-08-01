import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { transactionRollback } from "../../lib/transactionRollback";
import { generateTrackingID } from "../../utils/idGenerator";
import { mongoIdValidator } from "../../utils/mongoIdValidator";
import { eUserRoles } from "../user/user.interface";
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

  payload.rent = rates[type] * payload.weight;
  payload.trackingId = generateTrackingID();
  payload.sender = decoded._id;

  const parcel = await Parcel.create(payload);

  return { data: parcel };
};

//
export const updateParcelService = async (req: Request) => {
  const id = mongoIdValidator(req.params?.parcelId || "");
  const payload = req.body as Partial<iParcel>;
  const { role, _id } = req.decoded as JwtPayload;
  const { SENDER, RECEIVER, ADMIN } = eUserRoles;

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
        `You're not allowed to update these fields: ${forbiddenFields.join(", ")}`
      );
    }
  }

  delete payload.trackingId;
  delete payload.status;
  delete payload.statusLogs;

  return await transactionRollback(async (session) => {
    const updatedParcel = await Parcel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    if (!updatedParcel) {
      throw new AppError(sCode.NOT_FOUND, "Parcel not found");
    }

    if (role !== ADMIN && updatedParcel.sender.toString() !== _id) {
      throw new AppError(
        sCode.FORBIDDEN,
        "Only sender or admin can update the parcel"
      );
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
  const parcelId = req.params.parcelId;
  const { _id, role } = req.decoded as JwtPayload;
  const { ADMIN } = eUserRoles;
  const { note } = req.body;

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  // Access control
  if (role !== ADMIN && String(parcel.sender) !== _id) {
    throw new AppError(
      sCode.FORBIDDEN,
      `Only the sender or an admin can cancel the parcel`
    );
  }

  const { Requested, Approved, Cancelled } = eParcelStatus;
  const cancellableStatuses = [Requested, Approved];

  if (!cancellableStatuses.includes(parcel.status) && role !== ADMIN) {
    throw new AppError(sCode.BAD_REQUEST, `Parcel already ${parcel.status}`);
  }

  const previousStatus = parcel.status;

  parcel.status = Cancelled;
  parcel.statusLogs.push({
    status: Cancelled,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(_id),
    note: note || `Status changed from ${previousStatus} to Cancelled`,
  });

  await parcel.save();

  return {
    data: parcel,
  };
};

//
export const confirmParcelService = async (req: Request) => {
  const parcelId = req.params?.parcelId || "";
  const { note } = req.body;
  const { _id } = req.decoded as JwtPayload;

  const { Received } = eParcelStatus;

  const parcel = await Parcel.findById(mongoIdValidator(parcelId));
  if (!parcel) throw new AppError(404, "Parcel not found");

  if (_id !== String(parcel.receiver)) {
    throw new AppError(
      sCode.FORBIDDEN,
      "Only the receiver can confirm the parcel"
    );
  }

  if (parcel.status === Received) {
    throw new AppError(sCode.BAD_REQUEST, "Parcel already received");
  }

  const previousStatus = parcel.status;

  parcel.status = Received;
  parcel.statusLogs.push({
    status: Received,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(_id),
    note: note || `Status changed from ${previousStatus} to Received`,
  });

  await parcel.save();

  return {
    data: parcel,
  };
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
export const getAllParcelService = async () => {
  const parcels = await Parcel.find();
  const total = await Parcel.estimatedDocumentCount();

  return {
    data: parcels,
    meta: { total_data: total },
  };
};

//
export const getSingleParcelService = async (id: string) => {
  const parcel = await Parcel.findById(mongoIdValidator(id));
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
  const { _id } = req.decoded as JwtPayload;
  const parcelId = req.params?.parcelId || "";
  const { deletedStatus, presentStatus, note, updatedAt } = req.body;

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

  parcel.status = presentStatus;
  parcel.statusLogs.push({
    status: presentStatus,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(_id),
    note: note || `Status updated to ${presentStatus}`,
  });

  await parcel.save();

  return {
    data: {
      message: "Status log deleted and new status added",
      currentStatus: parcel.status,
      totalLogs: parcel.statusLogs.length,
    },
  };
};
