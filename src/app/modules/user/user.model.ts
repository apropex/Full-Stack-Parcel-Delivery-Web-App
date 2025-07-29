import { model, Schema } from "mongoose";
import {
  eAddressType,
  eIsActive,
  eUserRoles,
  iAuthProvider,
  iUser,
  iUserAddress,
  iUserName,
} from "./user.interface";

const options = { versionKey: false, _id: false };

const userNameSchema = new Schema<iUserName>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
  },
  options
);

const userAddressSchema = new Schema<iUserAddress>(
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
      required: [true, "Street is required"],
      trim: true,
    },
    addressType: {
      type: String,
      enum: {
        values: Object.values(eAddressType),
        message: `Address type must be in between ${Object.values(eAddressType).join(", ")}`,
      },
    },
  },
  options
);

const authProviderSchema = new Schema<iAuthProvider>(
  {
    provider: { type: String },
    providerId: { type: String },
  },
  options
);

const userSchema = new Schema<iUser>(
  {
    name: userNameSchema,
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Email is required"],
      trim: true,
    },
    password: { type: String, default: "", select: false },
    phone: { type: String },
    picture: { type: String },
    address: userAddressSchema,
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(eIsActive),
      default: eIsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auth: [authProviderSchema],
    role: {
      type: String,
      enum: Object.values(eUserRoles),
      default: eUserRoles.SENDER,
    },

    // TODO: added rest of fields
  },
  { versionKey: false, timestamps: true }
);

export const User = model<iUser>("User", userSchema);
