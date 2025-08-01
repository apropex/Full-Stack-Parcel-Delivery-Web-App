"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.appError = exports.castError = exports.mongooseError = exports.validationError = exports.zodValidationError = void 0;
//--------------
const zodValidationError = (err) => {
    var _a;
    const zError = (_a = err.issues) === null || _a === void 0 ? void 0 : _a.map((error) => {
        var _a;
        return ({
            path: (_a = error === null || error === void 0 ? void 0 : error.path) === null || _a === void 0 ? void 0 : _a.join("/"),
            message: error === null || error === void 0 ? void 0 : error.message,
        });
    });
    return [{ name: err === null || err === void 0 ? void 0 : err.name }, ...zError];
};
exports.zodValidationError = zodValidationError;
//--------------
const validationError = (err) => {
    const formattedErrors = Object.values((err === null || err === void 0 ? void 0 : err.errors) || {}).map((error) => {
        if (error.name === "ValidatorError") {
            return {
                path: error.path,
                message: error.message,
            };
        }
        if (error.name === "CastError") {
            const expectedType = error.kind || "unknown";
            const receivedType = error.valueType || typeof error.value;
            const valueString = JSON.stringify(error.value).replace(/^"(.*)"$/, "$1");
            return {
                path: error.path || "unknown",
                message: `Field '${error.path}' must be of type ${expectedType}, but received '${valueString}' (type: ${receivedType})`,
            };
        }
        return {
            path: error.path || "unknown",
            message: error.message || "Invalid input",
        };
    });
    return [{ name: err === null || err === void 0 ? void 0 : err.name }, ...formattedErrors];
};
exports.validationError = validationError;
//--------------
const mongooseError = (err) => {
    var _a, _b;
    return [
        { name: err.name },
        { path: (_b = Object.keys((_a = err === null || err === void 0 ? void 0 : err.cause) === null || _a === void 0 ? void 0 : _a.keyValue)) === null || _b === void 0 ? void 0 : _b[0], message: err.message },
    ];
};
exports.mongooseError = mongooseError;
//--------------
const castError = (err) => {
    return [{ name: err.name }, { path: err.path, message: err.message }];
};
exports.castError = castError;
//--------------
const appError = (err) => {
    return [
        { name: (err === null || err === void 0 ? void 0 : err.name) || "Error" },
        { path: (err === null || err === void 0 ? void 0 : err.path) || "", message: err.message },
    ];
};
exports.appError = appError;
