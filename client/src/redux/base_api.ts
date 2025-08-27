import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const base_api = createApi({
  reducerPath: "base_api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER", "PARCEL", "PARCEL_STATUS"],
  endpoints: () => ({}),
});
