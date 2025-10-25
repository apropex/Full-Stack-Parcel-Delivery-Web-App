/* eslint-disable @typescript-eslint/no-explicit-any */
import { PipelineStage } from "mongoose";
import { eParcelTypes } from "../modules/parcel/parcel.interface";
import { mongoIdValidator } from "../utils/mongoIdValidator";

export interface ParcelQuery {
  search?: string;
  status?: string;
  type?: string;
  trackingId?: string;
  sort?: string;
  skip?: number;
  page?: number;
  limit?: number;
  sender?: string;
  receiver?: string;
}

export const getFilters = (query: ParcelQuery) => {
  const { search = "", status, type, trackingId, sender, receiver } = query;

  // Build match stage for filtering
  const matchStage: any = {};

  // Flexible search across title, description, and address fields
  if (search) {
    const searchRegex = { $regex: search.trim(), $options: "i" }; // Case-insensitive regex

    matchStage.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { "pickupAddress.street": searchRegex },
      { "pickupAddress.city": searchRegex },
      { "pickupAddress.stateOrProvince": searchRegex },
      { "pickupAddress.postalCode": searchRegex },
      { "pickupAddress.country": searchRegex },
      { "deliveryAddress.street": searchRegex },
      { "deliveryAddress.city": searchRegex },
      { "deliveryAddress.stateOrProvince": searchRegex },
      { "deliveryAddress.postalCode": searchRegex },
      { "deliveryAddress.country": searchRegex },
    ];
  }

  // Filter by status
  if (status) {
    matchStage.status = status;
  }

  // Filter by type (validate against enum)
  if (type && Object.values(eParcelTypes).includes(type as eParcelTypes)) {
    matchStage.type = type;
  }

  // Filter by trackingId
  if (trackingId) {
    matchStage.trackingId = trackingId;
  }

  // Filter by trackingId
  if (sender) {
    matchStage.sender = mongoIdValidator(sender);
  }

  // Filter by trackingId
  if (receiver) {
    matchStage.receiver = mongoIdValidator(receiver);
  }

  return matchStage;
};

export default function buildParcelPipeline(query: ParcelQuery): PipelineStage[] {
  const {
    sort = "-createdAt", // Default sort by createdAt
    skip = 0,
    limit = 8, // Default limit
  } = query;

  // Validate inputs to prevent invalid queries
  const safeSkip = Math.max(0, Number(skip) || 0);
  const safeLimit = Math.max(1, Math.min(Number(limit) || 12, 100)); // Cap limit at 100 for performance
  const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
  const sortOrder = sort.startsWith("-") ? -1 : 1;

  // Build the pipeline stages
  const pipeline: PipelineStage[] = [
    // Match stage for filtering (early for performance)
    { $match: getFilters(query) },

    // Lookup for sender
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },

    // Lookup for receiver
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },

    // Lookup for updatedUsers in statusLogs
    {
      $lookup: {
        from: "users",
        localField: "statusLogs.updatedBy",
        foreignField: "_id",
        as: "updatedUsers",
        pipeline: [{ $project: { _id: 1, name: 1 } }],
      },
    },

    // Transform and populate fields
    {
      $addFields: {
        sender: { $arrayElemAt: ["$sender", 0] },
        receiver: { $arrayElemAt: ["$receiver", 0] },
        statusLogs: {
          $map: {
            input: {
              $sortArray: {
                input: "$statusLogs",
                sortBy: { updatedAt: -1 }, // Sort statusLogs by updatedAt desc
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

    // Sort stage
    {
      $sort: {
        [sortField]: sortOrder,
      },
    },

    // Pagination: skip and limit
    { $skip: safeSkip },
    { $limit: safeLimit },
  ];

  return pipeline;
}
