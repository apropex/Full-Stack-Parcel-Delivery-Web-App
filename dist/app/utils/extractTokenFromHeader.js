"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = void 0;
const AppError_1 = require("../../errors/AppError");
const statusCode_1 = __importDefault(require("../../statusCode"));
const messages_1 = require("../constants/messages");
const extractTokenFromHeader = (authHeader) => {
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
        throw new AppError_1.AppError(statusCode_1.default.UNAUTHORIZED, messages_1.eJwtMessages.UNAUTHORIZED);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, messages_1.eJwtMessages.TOKEN_NOT_FOUND);
    }
    return token;
};
exports.extractTokenFromHeader = extractTokenFromHeader;
