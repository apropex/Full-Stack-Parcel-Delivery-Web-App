"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, payload) => {
    const { statusCode, success = true, message, data = null, meta = null, } = payload;
    res.status(statusCode).json({
        statusCode,
        success,
        message,
        meta,
        data,
    });
};
exports.sendResponse = sendResponse;
