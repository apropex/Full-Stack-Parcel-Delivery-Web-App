import { eParcelStatus } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { eUserRoles } from "../user/user.interface";
import { User } from "../user/user.model";

/**
 * Get total counts for core entities.
 * Returns total parcels, total users, and total active users.
 */
export const getBasicCounts = async () => {
  const [totalParcels, totalUsers, activeUsers] = await Promise.all([
    Parcel.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ isActive: "ACTIVE" }),
  ]);

  return { totalParcels, totalUsers, activeUsers };
};

/**
 * Get parcel count by status.
 * Returns an object mapping each eParcelStatus to its count.
 */
export const getParcelStatusStats = async () => {
  const statusCounts = await Parcel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const result: Record<string, number> = {};
  for (const item of statusCounts) {
    result[item._id] = item.count;
  }

  return result;
};

/**
 * Get total parcels sent and received by each user (for top users analytics).
 * Returns top 5 senders and top 5 receivers sorted by parcel count.
 */
export const getTopUsersByParcels = async () => {
  const [topSenders, topReceivers] = await Promise.all([
    Parcel.aggregate([
      { $group: { _id: "$sender", totalSent: { $sum: 1 } } },
      { $sort: { totalSent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "senderInfo",
        },
      },
      { $unwind: "$senderInfo" },
      {
        $project: {
          _id: 1,
          totalSent: 1,
          "senderInfo.name": 1,
          "senderInfo.email": 1,
        },
      },
    ]),
    Parcel.aggregate([
      { $group: { _id: "$receiver", totalReceived: { $sum: 1 } } },
      { $sort: { totalReceived: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "receiverInfo",
        },
      },
      { $unwind: "$receiverInfo" },
      {
        $project: {
          _id: 1,
          totalReceived: 1,
          "receiverInfo.name": 1,
          "receiverInfo.email": 1,
        },
      },
    ]),
  ]);

  return { topSenders, topReceivers };
};

/**
 * Get monthly parcel trend (for chart analytics).
 * Returns array of objects with { month, total } for the current year.
 */
export const getMonthlyParcelTrend = async () => {
  const currentYear = new Date().getFullYear();

  const monthlyTrend = await Parcel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return monthlyTrend.map((m) => ({
    month: m._id,
    total: m.total,
  }));
};

/**
 * Get overall delivery performance summary.
 * Returns total delivered, total cancelled, and total in transit.
 */
export const getDeliveryPerformance = async () => {
  const [delivered, cancelled, inTransit] = await Promise.all([
    Parcel.countDocuments({ status: eParcelStatus.Delivered }),
    Parcel.countDocuments({ status: eParcelStatus.Cancelled }),
    Parcel.countDocuments({ status: eParcelStatus.In_Transit }),
  ]);

  return { delivered, cancelled, inTransit };
};

/**
 * Get user role statistics (Admin / Sender / Receiver).
 */
export const getUserRoleStats = async () => {
  const roleStats = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);

  const result: Record<eUserRoles, number> = {
    ADMIN: 0,
    SENDER: 0,
    RECEIVER: 0,
  };

  for (const r of roleStats) {
    result[r._id as eUserRoles] = r.count;
  }

  return result;
};

/**
 * Combine all analytics data into a single meta summary.
 * Returns comprehensive analytics for dashboard.
 */
export const getDashboardAnalytics = async () => {
  const [
    counts,
    parcelStatusStats,
    topUsers,
    monthlyTrend,
    deliveryPerformance,
    userRoleStats,
  ] = await Promise.all([
    getBasicCounts(),
    getParcelStatusStats(),
    getTopUsersByParcels(),
    getMonthlyParcelTrend(),
    getDeliveryPerformance(),
    getUserRoleStats(),
  ]);

  return {
    counts,
    parcelStatusStats,
    topUsers,
    monthlyTrend,
    deliveryPerformance,
    userRoleStats,
  };
};
