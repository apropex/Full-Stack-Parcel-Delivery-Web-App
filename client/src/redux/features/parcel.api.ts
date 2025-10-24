import { base_api } from "@/redux/base_api";
import type {
  iDeleteStatus,
  iParcelResponse,
  iResponse,
  iSearchParams,
  iUpdateStatus,
  iUpdateStatusLogs,
} from "@/types";

export const parcel_api = base_api.injectEndpoints({
  endpoints: (builder) => ({
    //

    createParcel: builder.mutation<iResponse<iParcelResponse>, FormData>({
      query: (data) => ({
        url: "/parcel/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    updateParcel: builder.mutation<iResponse<null>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/parcel/update-parcel/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    getAllParcels: builder.query<iResponse<iParcelResponse[]>, iSearchParams>({
      query: (params) => ({
        url: "/parcel/all-parcels",
        method: "GET",
        params,
      }),
      providesTags: ["PARCEL", "PARCEL_STATUS"],
    }),

    myParcels: builder.query<iParcelResponse[], null, iResponse<iParcelResponse[]>>({
      query: () => ({
        url: "/parcel/my-parcels",
        method: "GET",
      }),
      providesTags: ["PARCEL", "PARCEL_STATUS"],
      transformResponse: (value) => value.data,
    }),

    incomingParcels: builder.query<iParcelResponse[], null, iResponse<iParcelResponse[]>>(
      {
        query: () => ({
          url: "/parcel/incoming-parcels",
          method: "GET",
        }),
        providesTags: ["PARCEL", "PARCEL_STATUS"],
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
      providesTags: ["PARCEL_STATUS"],
      transformResponse: (value) => value.data,
    }),

    deleteParcel: builder.mutation<iResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/parcel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    cancelParcel: builder.mutation<
      iResponse<null>,
      { id: string; data: { note: string } }
    >({
      query: ({ id, data }) => ({
        url: `/parcel/cancel/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    confirmParcel: builder.mutation<
      iResponse<null>,
      { id: string; data: { note: string } }
    >({
      query: ({ id, data }) => ({
        url: `/parcel/confirm/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    // admin api
    updateStatus: builder.mutation<iResponse<null>, iUpdateStatus>({
      query: ({ id, data }) => ({
        url: `/parcel/update-parcel-status/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    updateStatusLogs: builder.mutation<iResponse<null>, iUpdateStatusLogs>({
      query: ({ id, data }) => ({
        url: `/parcel/update-parcel-status-log/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    deleteStatus: builder.mutation<iResponse<null>, iDeleteStatus>({
      query: ({ id, data }) => ({
        url: `/parcel/status/${id}`,
        method: "DELETE",
        data,
      }),
      invalidatesTags: ["PARCEL_STATUS", "PARCEL"],
    }),

    //
  }),
});

export const {
  useCreateParcelMutation,
  useUpdateParcelMutation,
  useGetAllParcelsQuery,
  useMyParcelsQuery,
  useIncomingParcelsQuery,
  useGetSingleParcelQuery,
  useDeleteParcelMutation,
  useCancelParcelMutation,
  useConfirmParcelMutation,
  //
  useUpdateStatusMutation,
  useUpdateStatusLogsMutation,
  useDeleteStatusMutation,
} = parcel_api;
