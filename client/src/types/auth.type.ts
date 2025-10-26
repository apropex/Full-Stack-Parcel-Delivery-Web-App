//

import type { ROLES } from "@/constants";

export type tRole = (typeof ROLES)[keyof typeof ROLES];

export interface iLogin {
  email: string;
  password: string;
}

export interface iSendOtp {
  email: string;
}

export interface iVerifyOtp {
  otp: string;
  email: string;
}

export interface iUserName {
  firstName: string;
  lastName: string;
}

export interface iAuth {
  provider: string;
  providerId: string;
}

export interface iAddress {
  street: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  landmark?: string;
  addressType?: string;
}

export interface iUserInfo {
  _id: string;
  name: iUserName;
  email: string;
  image: string;
  isDeleted: boolean;
  isActive: string;
  address?: iAddress;
  phone?: string;
  isVerified: boolean;
  auth: iAuth[];
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function isUserInfo(user: unknown): user is iUserInfo {
  return typeof user === "object" && user !== null;
}
