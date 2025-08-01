"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoIdValidator = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = require("../../errors/AppError");
const statusCode_1 = __importDefault(require("../../statusCode"));
const mongoIdValidator = (id) => {
    if (mongoose_1.Types.ObjectId.isValid(id))
        return new mongoose_1.Types.ObjectId(id);
    throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "Invalid MongoDB ID format");
};
exports.mongoIdValidator = mongoIdValidator;
