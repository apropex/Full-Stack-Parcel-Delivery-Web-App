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

    updateParcel: builder.mutation<iResponse<null>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/parcel/update-parcel/${id}`,
        method: "PATCH",
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

    getSingleParcel: builder.query<
      iParcelResponse,
      { id: string },
      iResponse<iParcelResponse>
    >({
      query: ({ id }) => ({
        url: `/parcel/${id}`,
        method: "GET",
      }),
      transformResponse: (value) => value.data,
    }),

    deleteParcel: builder.mutation<iResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/parcel/${id}`,
        method: "DELETE",
      }),
    }),

    cancelParcel: builder.mutation<iResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/parcel/cancel/${id}`,
        method: "PATCH",
      }),
    }),

    confirmParcel: builder.mutation<iResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/parcel/confirm/${id}`,
        method: "PATCH",
      }),
    }),

    //
  }),
});

export const {
  useCreateParcelMutation,
  useMyParcelsQuery,
  useIncomingParcelsQuery,
  useGetSingleParcelQuery,
  useDeleteParcelMutation,
  useUpdateParcelMutation,
  useCancelParcelMutation,
  useConfirmParcelMutation,
} = parcel_api;
