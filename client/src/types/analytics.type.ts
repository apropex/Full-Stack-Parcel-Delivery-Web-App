import type { ParcelStatus } from "@/constants";

export interface iDashboardAnalyticsResponse {
  counts: {
    totalParcels: number;
    totalUsers: number;
    activeUsers: number;
  };
  parcelStatusStats: {
    [key in iParcelStatus]?: number;
  };
  topUsers: {
    topSenders: Array<{
      _id: string;
      totalSent: number;
      senderInfo: {
        name: { firstName: string; lastName: string };
        email: string;
      };
    }>;
    topReceivers: Array<{
      _id: string;
      totalReceived: number;
      receiverInfo: {
        name: { firstName: string; lastName: string };
        email: string;
      };
    }>;
  };
  monthlyTrend: Array<{
    month: number;
    total: number;
  }>;
  deliveryPerformance: {
    delivered: number;
    cancelled: number;
    inTransit: number;
  };
  userRoleStats: Record<"ADMIN" | "SENDER" | "RECEIVER", number>;
}

export type iParcelStatus = (typeof ParcelStatus)[keyof typeof ParcelStatus];
