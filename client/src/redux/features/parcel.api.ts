import { base_api } from "@/redux/base_api";
import type { iParcelResponse, iResponse } from "@/types";

export const parcel_api = base_api.injectEndpoints({
  endpoints: (builder) => ({
    createParcel: builder.mutation<iResponse<iParcelResponse>, FormData>({
      query: (data) => ({
        url: "/parcel/create",
        method: "POST",
        data,
      }),
    }),

    myParcels: builder.query<iResponse<iParcelResponse>, null>({
      query: () => ({
        url: "/parcel/my-parcels",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateParcelMutation, useMyParcelsQuery } = parcel_api;
