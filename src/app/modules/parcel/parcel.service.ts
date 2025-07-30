import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloud } from "../../../config/cloudinary/deleteImageFromCloud";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { iReqQueryParams } from "../../global-interfaces";
import { QueryBuilder } from "../../lib/queryBuilder";
import { transactionRollback } from "../../lib/transactionRollback";
import { mongoIdValidator } from "../../utils/mongoIdValidator";
import { eUserRoles } from "../user/user.interface";
import { parcelSearchFields } from "./parcel.constant";
import { eParcelStatus, iParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

export const createdParcelService = async (payload: iParcel) => {
  const data = await Parcel.create(payload);
  return { data };
};

//
export const updateParcelService = async (req: Request) => {
  const id = mongoIdValidator(req.params?.parcelId || "");
  const payload = req.body as Partial<iParcel>;

  if ("trackingId" in payload) delete payload.trackingId;
  if ("status" in payload) delete payload.status;
  if ("statusLogs" in payload) delete payload.statusLogs;

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
  const { newStatus, note } = req.body;

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  parcel.statusLogs.push({
    status: newStatus,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(req.decoded?._id),
    note: note || `Status updated to ${newStatus}`,
  });

  parcel.status = newStatus;

  await parcel.save();
  return { data: parcel };
};

//
export const updateParcelStatusLogsService = async (req: Request) => {
  const parcelId = req.params.parcelId;
  const { note, status, updatedAt } = req.body;

  if (!parcelId || !status || !updatedAt) {
    throw new AppError(400, "parcelId, status, and updatedAt are required");
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
    message: "Status log updated successfully",
  };
};

//
export const getAllParcel = async (query: iReqQueryParams) => {
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
    message: "Status log deleted and new status added",
    currentStatus: parcel.status,
    totalLogs: parcel.statusLogs.length,
  };
};
