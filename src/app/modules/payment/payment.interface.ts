import { Types } from "mongoose";
import { ePaymentStatus } from "../../global-interfaces";
import { iParcel } from "../parcel/parcel.interface";

export interface iPayment extends Document {
  parcel: Types.ObjectId | iParcel;
  TrxID: string;
  rent: number;
  paymentInfo?: Record<string, string>;
  invoiceUrl?: string;
  status: ePaymentStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
