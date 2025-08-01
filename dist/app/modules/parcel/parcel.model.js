"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const global_models_1 = require("../../global-models");
const parcel_interface_1 = require("./parcel.interface");
const types = Object.values(parcel_interface_1.eParcelTypes);
const status = Object.values(parcel_interface_1.eParcelStatus);
const statusLogSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Moderator ID is required"],
    },
    note: { type: String },
}, { versionKey: false, _id: false });
const parcelSchema = new mongoose_1.Schema({
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
    rent: { type: Number, required: [true, "Parcel rent is required"] },
    images: { type: [String] },
    pickupAddress: {
        type: global_models_1.addressSchema,
        required: [true, "Pickup address is required"],
    },
    deliveryAddress: {
        type: global_models_1.addressSchema,
        required: [true, "Delivery Address is required"],
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender ID is required"],
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver ID is required"],
    },
    status: {
        type: String,
        enum: {
            values: status,
            message: `Parcel status must be in between ${status.join(", ")}`,
        },
        default: parcel_interface_1.eParcelStatus.Requested,
    },
    statusLogs: {
        type: [statusLogSchema],
        default: [],
    },
    isBlocked: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    estimatedDeliveryDate: { type: Date },
    deliveredAt: { type: Date },
}, { timestamps: true, versionKey: false });
// Add pre-save middleware
parcelSchema.pre("save", function (next) {
    if (this.isNew) {
        this.status = parcel_interface_1.eParcelStatus.Requested;
        this.statusLogs.push({
            status: parcel_interface_1.eParcelStatus.Requested,
            updatedAt: new Date(),
            updatedBy: this.sender,
            note: "Parcel created",
        });
    }
    next();
});
//
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
