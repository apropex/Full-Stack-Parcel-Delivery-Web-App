import { base_api } from "@/redux/base_api";
import type { iLogin, iResponse, iSendOtp, iUserInfo, iVerifyOtp } from "@/types";

export const auth_api = base_api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<iResponse<iUserInfo>, iLogin>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        data,
      }),
    }),

    logout: builder.mutation<iResponse<null>, null>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    sendOtp: builder.mutation<iResponse<null>, iSendOtp>({
      query: (data) => ({
        url: "/otp/send",
        method: "POST",
        data,
      }),
    }),

    verifyOtp: builder.mutation<iResponse<null>, iVerifyOtp>({
      query: (data) => ({
        url: "/otp/verify",
        method: "POST",
        data,
      }),
    }),

    myInfo: builder.query<iResponse<iUserInfo>, null>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    getSingleUser: builder.query<iUserInfo, { idOrEmail: string }, iResponse<iUserInfo>>({
      query: ({ idOrEmail }) => ({
        url: `/user/${idOrEmail}`,
        method: "GET",
      }),
      transformResponse: (value) => value.data,
      providesTags: ["USER"],
    }),

    updateUser: builder.mutation<iResponse<iUserInfo>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    //
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useMyInfoQuery,
  useGetSingleUserQuery,
  useLazyGetSingleUserQuery,
  useUpdateUserMutation,
} = auth_api;
