import { model, Schema } from "mongoose";
import { ePaymentStatus } from "../../global-interfaces";
import { iPayment } from "./payment.interface";

const status: string[] = Object.values(ePaymentStatus);

const paymentSchema = new Schema<iPayment>(
  {
    parcel: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking ID is required"],
    },
    TrxID: { type: String, unique: [true, "TrxID already exist"] },
    rent: { type: Number, required: [true, "Amount is required"] },
    paymentInfo: { type: Object },
    invoiceUrl: { type: String },
    status: {
      type: String,
      enum: {
        values: status,
        message: `Status must be in between ${status.join(", ")}`,
      },
      default: ePaymentStatus.UNPAID,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Payment = model<iPayment>("Payment", paymentSchema);
