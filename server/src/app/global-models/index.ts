import { Schema } from "mongoose";
import { eAddressType, iAddress } from "../global-interfaces";

const types: string[] = Object.values(eAddressType);

export const addressSchema = new Schema<iAddress>(
  {
    street: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    city: { type: String, required: [true, "Street is required"], trim: true },
    stateOrProvince: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    addressType: {
      type: String,
      enum: {
        values: types,
        message: `Address type must be in between ${types.join(", ")}`,
      },
    },
  },
  { versionKey: false, _id: false }
);
