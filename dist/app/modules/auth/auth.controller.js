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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPasswordController = exports.resetPasswordController = exports.forgotPasswordController = exports.changePasswordController = exports.userLogoutController = exports.getNewAccessTokenController = exports.googleCallbackController = exports.googleLoginUserController = exports.credentialLoginController = void 0;
const passport_1 = __importDefault(require("passport"));
const env_config_1 = __importDefault(require("../../../config/env.config"));
const AppError_1 = require("../../../errors/AppError");
const statusCode_1 = __importDefault(require("../../../statusCode"));
const catchAsync_1 = require("../../lib/catchAsync");
const cookie_1 = require("../../lib/cookie");
const jwt_1 = require("../../lib/jwt");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
//
exports.credentialLoginController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (error_1, user_1, _a) => __awaiter(void 0, [error_1, user_1, _a], void 0, function* (error, user, { message }) {
        if (error)
            return next(error);
        if (!user)
            return next(new AppError_1.AppError(statusCode_1.default.NOT_FOUND, message));
        const { accessToken, refreshToken } = (0, jwt_1.generateAllTokens)(user);
        cookie_1.setCookie.allTokens(res, accessToken, refreshToken);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: statusCode_1.default.OK,
            message: message,
            data: user,
        });
    }))(req, res);
}));
//
exports.googleLoginUserController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { redirect } = req.query || "/";
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res);
}));
//
exports.googleCallbackController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const redirectTo = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.state) || "";
    const user = req.user;
    if (!user)
        throw new AppError_1.AppError(statusCode_1.default.NOT_FOUND, "User not found!");
    const { accessToken, refreshToken } = (0, jwt_1.generateAllTokens)(user);
    cookie_1.setCookie.allTokens(res, accessToken, refreshToken);
    res.redirect(`${env_config_1.default.FRONTEND_URL}${redirectTo}`);
}));
//
exports.getNewAccessTokenController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken)
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "Refresh token not found");
    const token = yield (0, jwt_1.generateAccessTokenByRefreshToken)(refreshToken);
    cookie_1.setCookie.accessToken(res, token);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "New access token retrieved successfully",
        data: token,
    });
}));
//
exports.userLogoutController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    cookie_1.setCookie.clearCookies(res);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "User logged out successfully",
    });
}));
//
exports.changePasswordController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield (0, auth_service_1.changePasswordService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Password updated successfully",
        data: password,
    });
}));
//
exports.forgotPasswordController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield (0, auth_service_1.forgotPasswordService)(email);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Email sent successfully",
    });
}));
//
exports.resetPasswordController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, auth_service_1.resetPasswordService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Password updated successfully",
        data,
    });
}));
//
exports.setPasswordController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield (0, auth_service_1.setPasswordService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Password updated successfully",
        data: password,
    });
}));
