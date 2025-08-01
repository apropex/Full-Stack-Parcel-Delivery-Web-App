"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_MESSAGES = exports.eJwtMessages = exports.eAuthMessages = void 0;
//
var eAuthMessages;
(function (eAuthMessages) {
    eAuthMessages["LOGIN_SUCCESS"] = "User logged in successfully";
    eAuthMessages["CREATE_SUCCESS"] = "User created successfully";
    eAuthMessages["USER_NOT_FOUND"] = "User does not exist";
    eAuthMessages["USER_EXIST"] = "User already exist";
    eAuthMessages["INVALID_CREDENTIALS"] = "Invalid credentials";
    eAuthMessages["USER_BLOCKED"] = "User is blocked";
    eAuthMessages["USER_NOT_VERIFIED"] = "User is not verified";
    eAuthMessages["USER_DELETED"] = "User is deleted";
})(eAuthMessages || (exports.eAuthMessages = eAuthMessages = {}));
var eJwtMessages;
(function (eJwtMessages) {
    eJwtMessages["UNAUTHORIZED"] = "Unauthorized user";
    eJwtMessages["FORBIDDEN"] = "Forbidden user role";
    eJwtMessages["TOKEN_NOT_FOUND"] = "Token did not arrive";
    eJwtMessages["INVALID_TOKEN"] = "Invalid token";
})(eJwtMessages || (exports.eJwtMessages = eJwtMessages = {}));
exports.PAYMENT_MESSAGES = {
    SUCCESS: "Payment completed successfully",
    FAILED: "Payment failed",
    CANCELED: "Payment canceled",
};
