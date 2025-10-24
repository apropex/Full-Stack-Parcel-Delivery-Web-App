import { model, Schema } from "mongoose";
import { addressSchema } from "../../global-models";
import { eIsActive, eUserRoles, iAuthProvider, iUser, iUserName } from "./user.interface";

const roles: string[] = Object.values(eUserRoles);
const activeRole: string[] = Object.values(eIsActive);

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

const authProviderSchema = new Schema<iAuthProvider>(
  {
    provider: { type: String },
    providerId: { type: String },
  },
  options
);

const userSchema = new Schema<iUser>(
  {
    name: { type: userNameSchema, required: [true, "Name is required"] },
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Email is required"],
      trim: true,
    },
    password: { type: String, select: false },
    phone: { type: String },
    picture: { type: String },
    address: addressSchema,
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: {
        values: activeRole,
        message: `User active role must be in between ${activeRole.join(", ")}`,
      },
      default: eIsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: true }, // TODO: default: false
    auth: [authProviderSchema],
    role: {
      type: String,
      enum: {
        values: roles,
        message: `User role must be in between ${roles.join(", ")}`,
      },
      default: eUserRoles.SENDER,
    },

    // TODO: added rest of fields
  },
  { versionKey: false, timestamps: true }
);

export const User = model<iUser>("User", userSchema);
