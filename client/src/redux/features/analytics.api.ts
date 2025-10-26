import { base_api } from "@/redux/base_api";
import type { iDashboardAnalyticsResponse, iResponse } from "@/types";

export const analytics_api = base_api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<iResponse<iDashboardAnalyticsResponse>, void>({
      query: () => ({
        url: "/analytics/summary",
        method: "GET",
      }),
      providesTags: ["ANALYTICS"],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = analytics_api;
