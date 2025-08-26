/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
export type {
  iDeleteStatus,
  iParcelResponse,
  iStatusLog,
  iUpdateStatus,
  iUpdateStatusLogs,
} from "./parcel.type";

export type {
  iAuth,
  iLogin,
  iSendOtp,
  iUserInfo,
  iUserName,
  iVerifyOtp,
  tRole,
} from "./auth.type";

export interface iChildren {
  children: ReactNode;
}

export interface iResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    total_data?: number;
    filtered_data?: number;
    present_data?: number;
    total_page?: number;
    present_page?: number;
    skip?: number;
    limit?: number;
    options?: Record<string, any>;
  };
  data: T;
}

export interface iSidebarItem {
  title: string;
  Icon?: LucideIcon;
  items: {
    title: string;
    url: string;
    Component: ComponentType;
    Icon?: LucideIcon;
  }[];
}
