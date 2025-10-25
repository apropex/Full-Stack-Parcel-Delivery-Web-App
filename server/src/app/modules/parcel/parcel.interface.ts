import { Document, Types } from "mongoose";
import { iAddress } from "../../global-interfaces";
import { iUser } from "../user/user.interface";

/*
* Requested   — Sender পার্সেল পাঠানোর অনুরোধ করেছে।
* Approved    — Admin পার্সেলটি অনুমোদন করেছে।
* Dispatched  — পার্সেলটি কুরিয়ার বা ডেলিভারি সিস্টেমে হস্তান্তর হয়েছে।
* In_Transit  — পার্সেলটি গন্তব্যে পৌঁছানোর পথে রয়েছে।
* Delivered   — পার্সেলটি Receiver এর ঠিকানায় পৌঁছানো হয়েছে (ডেলিভারি হয়েছে)।
* Received    — Receiver পার্সেল হাতে পেয়েছে (প্রসেস শেষ)।

* Cancelled   — কোনো কারণে প্রসেস বাতিল করা হয়েছে (যেমন: Sender/Receiver এর অনুরোধে)।
* Blocked     — Admin-এর দ্বারা পার্সেল ফ্লো ব্লক করা হয়েছে, হয়তো সন্দেহজনক কার্যকলাপের জন্য।
*/

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
  updatedFrom: string;
  note?: string;
}

export interface iParcel extends Document {
  trackingId: string;
  type: eParcelTypes;
  weight: number;
  rent: number;

  title: string;
  description: string;
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

export interface ParcelWithRelations {
  _id: string;
  title: string;
  description: string;
  trackingId: string;
  estimatedDeliveryDate: Date;
  pickupAddress: iAddress;
  deliveryAddress: iAddress;
  type: string;
  weight: number;
  rent: number;
  sender: iUser;
  receiver: iUser;
  createdAt: Date;
}
