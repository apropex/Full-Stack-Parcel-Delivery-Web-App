import { Document } from "mongoose";
import { iAddress } from "../../global-interfaces";

export enum eUserRoles {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
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

export interface iUser extends Document {
  name: iUserName;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: iAddress;
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
