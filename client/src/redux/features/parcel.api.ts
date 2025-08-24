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

    myParcels: builder.query<iParcelResponse[], null, iResponse<iParcelResponse[]>>({
      query: () => ({
        url: "/parcel/my-parcels",
        method: "GET",
      }),
      transformResponse: (value) => value.data,
    }),

    incomingParcels: builder.query<iParcelResponse[], null, iResponse<iParcelResponse[]>>(
      {
        query: () => ({
          url: "/parcel/incoming-parcels",
          method: "GET",
        }),
        transformResponse: (value) => value.data,
      }
    ),

    //
  }),
});

export const { useCreateParcelMutation, useMyParcelsQuery, useIncomingParcelsQuery } =
  parcel_api;
