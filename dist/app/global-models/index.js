"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
const global_interfaces_1 = require("../global-interfaces");
const types = Object.values(global_interfaces_1.eAddressType);
exports.addressSchema = new mongoose_1.Schema({
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
}, { versionKey: false, _id: false });
