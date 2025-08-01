"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalErrorHandler;
const env_config_1 = require("../../config/env.config");
const errors_1 = require("../../errors");
const AppError_1 = require("../../errors/AppError");
//
function globalErrorHandler(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const errCode = (err === null || err === void 0 ? void 0 : err.code) || ((_a = err === null || err === void 0 ? void 0 : err.cause) === null || _a === void 0 ? void 0 : _a.code) || null;
        const message = (err === null || err === void 0 ? void 0 : err.message) || "Internal Server Error";
        const response = {
            statusCode: (err === null || err === void 0 ? void 0 : err.statusCode) || 500,
            success: false,
            message,
            error: [
                { name: (err === null || err === void 0 ? void 0 : err.name) || "Error" },
                { path: err === null || err === void 0 ? void 0 : err.path, message: (err === null || err === void 0 ? void 0 : err.errors) || message },
            ],
            stack: env_config_1.isDev ? err === null || err === void 0 ? void 0 : err.stack : undefined,
        };
        if (err instanceof AppError_1.AppError)
            response.error = (0, errors_1.appError)(err);
        switch (err === null || err === void 0 ? void 0 : err.name) {
            case "ValidationError":
                response.statusCode = 400;
                response.message = "Validation Failed";
                response.error = (0, errors_1.validationError)(err);
                break;
            case "MongooseError":
                response.statusCode = errCode ? 409 : 400;
                response.message = "Database Error";
                response.error = (0, errors_1.mongooseError)(err);
                break;
            case "CastError":
                response.statusCode = 400;
                response.message = "Invalid ID Format";
                response.error = (0, errors_1.castError)(err);
                break;
            case "ZodError":
                response.statusCode = 400;
                response.message = "Zod Validation Error";
                response.error = (0, errors_1.zodValidationError)(err);
                break;
        }
        res.status(response.statusCode).json(response);
    });
}
