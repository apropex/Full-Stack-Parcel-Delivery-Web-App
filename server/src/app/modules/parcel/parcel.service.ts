import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { deleteImageFromCloud } from "../../../config/cloudinary/deleteImageFromCloud";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import buildParcelPipeline, { getFilters, ParcelQuery } from "../../lib/buildParcelPipeline";
import { transactionRollback } from "../../lib/transactionRollback";
import { generateTrackingID } from "../../utils/idGenerator";
import { mongoIdValidator } from "../../utils/mongoIdValidator";
import { eUserRoles } from "../user/user.interface";
import { eParcelStatus, eParcelTypes, iParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const rent = (parcelType: eParcelTypes, weight: number) => {
  const parcelRates = { Document: 40, Box: 60, Fragile: 50, Other: 80 };
  const type = Object.keys(parcelRates).find((rate) => rate === parcelType) as eParcelTypes;
  return parcelRates[type] * weight;
};

export const createdParcelService = async (req: Request) => {
  const decoded = req.decoded as JwtPayload;
  const payload = req.body;

  if (!payload.type || !payload.weight) {
    throw new AppError(sCode.BAD_REQUEST, "Parcel type and weight is required");
  }

  payload.rent = rent(payload.type, payload.weight);
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

  // TRANSACTION ROLLBACK

  return await transactionRollback(async (session) => {
    const parcel = await Parcel.findById(id).session(session);

    if (!parcel) {
      throw new AppError(sCode.NOT_FOUND, "Parcel not found");
    }

    if (role !== ADMIN && parcel.sender.toString() !== _id) {
      throw new AppError(sCode.FORBIDDEN, "Only sender or admin can update the parcel");
    }

    const oldImages = parcel.images || [];
    const delImg = payload.deletedImages || [];
    const images = payload.images || [];

    const remainingImages = oldImages.filter((img) => !delImg.includes(img));
    payload.images = [...images, ...remainingImages];

    Object.assign(parcel, payload);

    if ("weight" in payload || "type" in payload) {
      parcel.rent = rent(parcel.type, parcel.weight);
    }

    await parcel.save({ session });

    if (delImg.length > 0) await Promise.all(delImg.map((url) => deleteImageFromCloud(url)));

    return { data: parcel };
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
    updatedFrom: `Status updated from ${parcel.status} to ${status}`,
    note: note || "",
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
    throw new AppError(sCode.FORBIDDEN, `Only the sender or an admin can cancel the parcel`);
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
    updatedFrom: `Status changed from ${previousStatus} to Cancelled`,
    note: note || "",
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

  const { Received, Cancelled, Blocked } = eParcelStatus;

  const parcel = await Parcel.findById(mongoIdValidator(parcelId));
  if (!parcel) throw new AppError(404, "Parcel not found");

  if (_id !== String(parcel.receiver)) {
    throw new AppError(sCode.FORBIDDEN, "Only the receiver can confirm the parcel");
  }

  const status = parcel.status;

  if (status === Received) {
    throw new AppError(sCode.BAD_REQUEST, "Parcel already received");
  }
  if (status === Cancelled) {
    throw new AppError(sCode.BAD_REQUEST, "The parcel is canceled");
  }
  if (status === Blocked) {
    throw new AppError(sCode.BAD_REQUEST, "The parcel is blocked");
  }

  const previousStatus = parcel.status;

  parcel.status = Received;
  parcel.statusLogs.push({
    status: Received,
    updatedAt: new Date(),
    updatedBy: mongoIdValidator(_id),
    updatedFrom: `Status changed from ${previousStatus} to Received`,
    note: note || "",
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
    throw new AppError(400, "status, and updatedAt are required");
  }

  const updatedParcel = await Parcel.findOneAndUpdate(
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
      new: true,
    }
  );

  if (!updatedParcel) {
    throw new AppError(404, "No matching status log found to update");
  }

  return {
    data: updatedParcel,
  };
};

//
export const getAllParcelService = async (query: ParcelQuery) => {
  /*
  const parcels = await Parcel.find()
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate({
      path: "statusLogs.updatedBy",
      select: "name",
    })
    .select({
      statusLogs: { $slice: -3 }, // get latest 3 status logs only
    });
    */

  // query.search - flexible search for title,description,and all address fields
  // query.status - filter parcel status field
  // query.trackingId - filter parcel trackingId
  // query.skip - skip pages
  // query.limit - skip limit (default 12)

  /*
  const parcels = await Parcel.aggregate([
    {
      $lookup: {
        from: "users", // sender
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },
    {
      $lookup: {
        from: "users", // receiver
        localField: "receiver",
        foreignField: "_id",
        as: "receiver",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },
    {
      $lookup: {
        from: "users", // statusLogs.updatedBy
        localField: "statusLogs.updatedBy",
        foreignField: "_id",
        as: "updatedUsers",
        pipeline: [{ $project: { _id: 1, name: 1 } }],
      },
    },
    {
      $addFields: {
        sender: { $arrayElemAt: ["$sender", 0] },
        receiver: { $arrayElemAt: ["$receiver", 0] },
        statusLogs: {
          $map: {
            input: {
              $sortArray: {
                input: "$statusLogs",
                sortBy: { updatedAt: -1 },
              },
            },
            as: "log",
            in: {
              status: "$$log.status",
              updatedAt: "$$log.updatedAt",
              updatedFrom: "$$log.updatedFrom",
              note: "$$log.note",
              updatedBy: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$updatedUsers",
                      cond: { $eq: ["$$this._id", "$$log.updatedBy"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },
  ]);*/

  const page = Math.ceil(Number(query?.page || "1"));
  const limit = Math.ceil(Number(query?.limit || "8"));
  const skip = (page - 1) * limit;

  if (!query.skip) query.skip = skip;

  const pipeline = buildParcelPipeline(query);
  const parcels = await Parcel.aggregate(pipeline);

  const filteredCount = await Parcel.countDocuments(getFilters(query));
  const totalDataCount = await Parcel.estimatedDocumentCount();

  const ls = limit + skip;

  return {
    data: parcels,
    meta: {
      total_data: totalDataCount,
      filtered_data: filteredCount,
      present_data: filteredCount > ls ? limit : filteredCount - skip,
      total_page: Math.ceil(filteredCount / limit),
      present_page: page,
      skip,
      limit: limit,
    },
  };
};

//
export const getSingleParcelService = async (id: string) => {
  /*
  const parcel = await Parcel.findById(mongoIdValidator(id))
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate({
      path: "statusLogs.updatedBy",
      select: "name",
    });
    */

  const parcel = await Parcel.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) },
    },

    // sender lookup
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [
          { $project: { _id: 1, name: 1, email: 1 } }, // needed fields
        ],
      },
    },

    // receiver lookup
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },

    // updatedBy lookup
    {
      $lookup: {
        from: "users",
        localField: "statusLogs.updatedBy",
        foreignField: "_id",
        as: "updatedUsers",
        pipeline: [
          { $project: { _id: 1, name: 1 } }, // needed fields
        ],
      },
    },

    {
      $addFields: {
        sender: { $arrayElemAt: ["$sender", 0] },
        receiver: { $arrayElemAt: ["$receiver", 0] },

        statusLogs: {
          $map: {
            input: {
              $sortArray: {
                input: "$statusLogs",
                sortBy: { updatedAt: -1 },
              },
            },
            as: "log",
            in: {
              status: "$$log.status",
              updatedAt: "$$log.updatedAt",
              updatedFrom: "$$log.updatedFrom",
              note: "$$log.note",
              updatedBy: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$updatedUsers",
                      cond: { $eq: ["$$this._id", "$$log.updatedBy"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  if (!parcel?.[0]) throw new AppError(sCode.NOT_FOUND, "Parcel not found with this ID");
  return { data: parcel?.[0] };
};

//
export const getSingleParcelStatusLogsService = async (id: string) => {
  const logs = await Parcel.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "statusLogs.updatedBy",
        foreignField: "_id",
        as: "updatedUsers",
        pipeline: [{ $project: { _id: 1, name: 1 } }],
      },
    },
    {
      $project: {
        _id: 0, // deselect the other parcel fields
        statusLogs: {
          $map: {
            input: {
              $sortArray: { input: "$statusLogs", sortBy: { updatedAt: -1 } },
            },
            as: "log",
            in: {
              status: "$$log.status",
              updatedAt: "$$log.updatedAt",
              updatedFrom: "$$log.updatedFrom",
              note: "$$log.note",
              updatedBy: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$updatedUsers",
                      cond: { $eq: ["$$this._id", "$$log.updatedBy"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  return { data: logs?.[0]?.statusLogs || [] };
};

//

/*
export const getMyParcelService = async (id: string, query: ParcelQuery) => {
  // --- Pagination setup ---
  const page = Math.floor(Number(query?.page || "1"));
  const limit = Math.floor(Number(query?.limit || "8"));
  const skip = (page - 1) * limit;

  // --- Filters ---
  const senderId = mongoIdValidator(id);
  const filter = { sender: senderId };

  // --- Total count before pagination ---
  const totalDataCount = await Parcel.countDocuments();

  // --- Count after applying filters ---
  const filteredCount = await Parcel.countDocuments(filter);

  // --- Fetch paginated parcel data ---
  const parcels = await Parcel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate({
      path: "statusLogs.updatedBy",
      select: "name",
    })
    .select({
      statusLogs: { $slice: -3 }, // get latest 3 status logs only
    })
    .lean();

  if (!parcels || parcels.length === 0) {
    throw new AppError(sCode.NOT_FOUND, "No parcels found for this sender");
  }

  // --- Meta calculation ---
  const ls = limit + skip;
  const totalPage = Math.ceil(filteredCount / limit);
  const presentData = filteredCount > ls ? limit : Math.max(filteredCount - skip, 0);

  // --- Response ---
  return {
    data: parcels,
    meta: {
      total_data: totalDataCount,
      filtered_data: filteredCount,
      present_data: presentData,
      total_page: totalPage,
      present_page: page,
      skip,
      limit,
    },
  };
};
*/

export const getMyParcelService = async (id: string, query: ParcelQuery) => {
  const page = Math.ceil(Number(query?.page || "1"));
  const limit = Math.ceil(Number(query?.limit || "8"));
  const skip = (page - 1) * limit;

  query.sender = id;
  if (!query.skip) query.skip = skip;

  const pipeline = buildParcelPipeline(query);
  const parcels = await Parcel.aggregate(pipeline);

  const filteredCount = await Parcel.countDocuments(getFilters(query));
  const totalDataCount = await Parcel.estimatedDocumentCount();

  const ls = limit + skip;

  return {
    data: parcels,
    meta: {
      total_data: totalDataCount,
      filtered_data: filteredCount,
      present_data: filteredCount > ls ? limit : filteredCount - skip,
      total_page: Math.ceil(filteredCount / limit),
      present_page: page,
      skip,
      limit: limit,
    },
  };
};

//
export const incomingParcelService = async (id: string, query: ParcelQuery) => {
  const page = Math.ceil(Number(query?.page || "1"));
  const limit = Math.ceil(Number(query?.limit || "8"));
  const skip = (page - 1) * limit;

  query.receiver = id;
  if (!query.skip) query.skip = skip;

  const pipeline = buildParcelPipeline(query);
  const parcels = await Parcel.aggregate(pipeline);

  const filteredCount = await Parcel.countDocuments(getFilters(query));
  const totalDataCount = await Parcel.estimatedDocumentCount();

  const ls = limit + skip;

  return {
    data: parcels,
    meta: {
      total_data: totalDataCount,
      filtered_data: filteredCount,
      present_data: filteredCount > ls ? limit : filteredCount - skip,
      total_page: Math.ceil(filteredCount / limit),
      present_page: page,
      skip,
      limit: limit,
    },
  };
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
    updatedFrom: `Status updated from ${deletedStatus} to ${presentStatus}`,
    note: note || "",
  });

  await parcel.save();

  return {
    data: parcel,
  };
};

export const deleteSingleParcelService = async (id: string) => {
  const data = await Parcel.findByIdAndDelete(mongoIdValidator(id));
  return { data };
};
