import type { iUserInfo } from "./auth.type";

export interface iParcelResponse {
  _id: string;
  trackingId: string;
  title: string;
  type: string;
  weight: number;
  rent: number;
  images: string[];
  pickupAddress: iPickupAddress;
  deliveryAddress: iDeliveryAddress;
  sender: string;
  receiver: string;
  status: string;
  isBlocked: boolean;
  isCancelled: boolean;
  statusLogs: iStatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface iPickupAddress {
  street: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

export interface iDeliveryAddress {
  street: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

export interface iStatusLog {
  status: string;
  updatedAt: string;
  updatedBy: string | iUserInfo;
  updatedFrom: string;
  note: string;
}

export interface iParcel {
  title: string;
  type: string;
  weight: number;
  pickupAddress: iPickupAddress;
  deliveryAddress: iDeliveryAddress;
  sender: iUserInfo | string;
  receiver: iUserInfo | string;
  status: string;
  isBlocked: boolean;
  isCancelled: boolean;
  statusLogs: iStatusLog[];
  createdAt: string;
  updatedAt: string;
}
