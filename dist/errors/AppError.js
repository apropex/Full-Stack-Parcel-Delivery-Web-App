"use strict";
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, path, customName, stack) {
        super(message);
        this.statusCode = statusCode;
        this.path = path;
        // Ensure correct prototype chain (important in TS when extending built-ins)
        Object.setPrototypeOf(this, new.target.prototype);
        // Override of built-in name
        if (customName)
            this.name = customName;
        // Maintain proper stack trace
        if (stack)
            this.stack = stack;
        else
            Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
