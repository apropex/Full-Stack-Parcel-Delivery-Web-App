import { Document } from "mongoose";

export enum eUserRoles {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export enum eIsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum eAuthProvider {
  google = "google",
  facebook = "facebook",
  credentials = "credentials",
}

export interface iAuthProvider {
  provider: eAuthProvider;
  providerId: string;
}

export interface iUserName {
  firstName: string;
  lastName: string;
}

export enum eAddressType {
  home = "home",
  office = "office",
  other = "other",
}

export interface iUserAddress {
  street: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  landmark?: string;
  addressType?: eAddressType;
}

export interface iUser extends Document {
  name: iUserName;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: iUserAddress;
  isDeleted?: boolean;
  isActive?: eIsActive;
  isVerified?: boolean;
  auth: iAuthProvider[];
  role: eUserRoles;
  // TODO: added rest of fields
}

export interface iUserResponse extends iUser {
  createdAt: Date;
  updatedAt: Date;
}
