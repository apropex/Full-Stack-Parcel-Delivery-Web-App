import { Document, Types } from "mongoose";
import { ePaymentStatus, iAddress } from "../../global-interfaces";
import { iUser } from "../user/user.interface";

export enum eParcelStatus {
  Requested = "Requested",
  Approved = "Approved",
  Dispatched = "Dispatched",
  In_Transit = "In_Transit",
  Delivered = "Delivered",
  Received = "Received",
  Cancelled = "Cancelled",
  Blocked = "Blocked",
}

export enum eParcelTypes {
  Document = "Document",
  Box = "Box",
  Fragile = "Fragile",
  Other = "Other",
}

export interface iStatusLog {
  status: eParcelStatus;
  updatedAt: Date;
  updatedBy: Types.ObjectId | iUser;
  note?: string;
}

export interface iParcel extends Document {
  trackingId: string;
  type: eParcelTypes;
  weight: number; // in kg
  payment: Types.ObjectId; //! TODO: | iPayment
  paymentStatus: ePaymentStatus;

  images?: string[];
  deletedImages: string[];
  pickupAddress: iAddress;
  deliveryAddress: iAddress;

  sender: Types.ObjectId | iUser;
  receiver: Types.ObjectId | iUser;

  status: eParcelStatus;
  statusLogs: iStatusLog[];

  isBlocked?: boolean;
  isCancelled?: boolean;

  estimatedDeliveryDate?: Date;
  deliveredAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
