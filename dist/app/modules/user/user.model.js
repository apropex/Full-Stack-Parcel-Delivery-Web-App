"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const global_models_1 = require("../../global-models");
const user_interface_1 = require("./user.interface");
const roles = Object.values(user_interface_1.eUserRoles);
const activeRole = Object.values(user_interface_1.eIsActive);
const options = { versionKey: false, _id: false };
const userNameSchema = new mongoose_1.Schema({
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
}, options);
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String },
    providerId: { type: String },
}, options);
const userSchema = new mongoose_1.Schema({
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
    address: global_models_1.addressSchema,
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: {
            values: activeRole,
            message: `User active role must be in between ${activeRole.join(", ")}`,
        },
        default: user_interface_1.eIsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auth: [authProviderSchema],
    role: {
        type: String,
        enum: {
            values: roles,
            message: `User role must be in between ${roles.join(", ")}`,
        },
        default: user_interface_1.eUserRoles.SENDER,
    },
    // TODO: added rest of fields
}, { versionKey: false, timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
