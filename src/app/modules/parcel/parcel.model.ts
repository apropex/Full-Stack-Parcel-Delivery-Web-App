import { model, Schema } from "mongoose";
import { addressSchema } from "../../global-models";
import {
  eParcelStatus,
  eParcelTypes,
  iParcel,
  iStatusLog,
} from "./parcel.interface";

const types: string[] = Object.values(eParcelTypes);
const status: string[] = Object.values(eParcelStatus);

const statusLogSchema = new Schema<iStatusLog>(
  {
    status: {
      type: String,
      enum: {
        values: status,
        message: `Parcel status must be in between ${status.join(", ")}`,
      },
      required: [true, "Parcel status is required"],
    },
    updatedAt: { type: Date, required: [true, "Updated time is required"] },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Moderator ID is required"],
    },
    note: { type: String },
  },
  { versionKey: false, _id: false }
);

const parcelSchema = new Schema<iParcel>(
  {
    trackingId: {
      type: String,
      required: [true, "Tracking ID is required"],
      unique: [true, "Tracking ID is already exist"],
    },
    type: {
      type: String,
      enum: {
        values: types,
        message: `Parcel type must be in between ${types.join(", ")}`,
      },
      required: [true, "Parcel type is required"],
    },
    weight: { type: Number, required: [true, "Parcel weight is required"] },
    fee: { type: Number, required: [true, "Parcel fee is required"] },
    images: { type: [String] },
    pickupAddress: {
      type: addressSchema,
      required: [true, "Pickup address is required"],
    },
    deliveryAddress: {
      type: addressSchema,
      required: [true, "Delivery Address is required"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required"],
    },
    status: {
      type: String,
      enum: {
        values: status,
        message: `Parcel status must be in between ${status.join(", ")}`,
      },
      required: [true, "Parcel status is required"],
    },
    statusLogs: {
      type: [statusLogSchema],
      required: [true, "Status log is required"],
    },
    isBlocked: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    estimatedDeliveryDate: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

// Add pre-save middleware
parcelSchema.pre("save", function (next) {
  if (this.isNew) {
    this.status = eParcelStatus.Requested;

    this.statusLogs.push({
      status: eParcelStatus.Requested,
      updatedAt: new Date(),
      updatedBy: this.sender,
      note: "Parcel created",
    });
  }

  next();
});

//
export const Parcel = model<iParcel>("Parcel", parcelSchema);
