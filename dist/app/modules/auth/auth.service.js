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
exports.setPasswordService = exports.resetPasswordService = exports.forgotPasswordService = exports.changePasswordService = exports.credentialLoginService = void 0;
const bcryptjs_1 = require("bcryptjs");
const env_config_1 = __importDefault(require("../../../config/env.config"));
const AppError_1 = require("../../../errors/AppError");
const statusCode_1 = __importDefault(require("../../../statusCode"));
const messages_1 = require("../../constants/messages");
const jwt_1 = require("../../lib/jwt");
const sendEmail_1 = require("../../lib/sendEmail");
const userChecker_1 = require("../../utils/userChecker");
const user_interface_1 = require("../user/user.interface");
//
const credentialLoginService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield (0, userChecker_1.getExistingUser)({ email, password: true });
    let isPasswordMatch = false;
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password) {
        isPasswordMatch = yield (0, bcryptjs_1.compare)(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    }
    if (!isPasswordMatch) {
        throw new AppError_1.AppError(statusCode_1.default.UNAUTHORIZED, messages_1.eAuthMessages.INVALID_CREDENTIALS);
    }
    const userData = isUserExist.toObject();
    delete userData.password;
    return { data: userData };
});
exports.credentialLoginService = credentialLoginService;
//
const changePasswordService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.decoded;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, !oldPassword ? "Old passwords is required" : "New passwords is required");
    }
    const user = yield (0, userChecker_1.getExistingUser)({ id: _id, password: true });
    const isMatched = yield (0, bcryptjs_1.compare)(oldPassword, user.password);
    if (!isMatched) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "Invalid password");
    }
    const hashedPassword = yield (0, bcryptjs_1.hash)(newPassword, env_config_1.default.BCRYPT_SALT_ROUND);
    user.password = hashedPassword;
    yield user.save();
    return {
        data: {
            _id: user._id,
            email: user.email,
            message: "Password updated successfully",
        },
    };
});
exports.changePasswordService = changePasswordService;
//
const forgotPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userChecker_1.getExistingUser)({ email });
    if (user.isDeleted)
        throw new AppError_1.AppError(400, "User is deleted");
    if (user.isActive === user_interface_1.eIsActive.BLOCKED)
        throw new AppError_1.AppError(400, "User is blocked");
    const token = (0, jwt_1.generateAccessToken)(user, "10m");
    const resetUILink = `${env_config_1.default.FRONTEND_URL}/reset-password?id=${user._id}&token=${encodeURIComponent(token)}`;
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "PH Tour | Password Reset",
        templateName: "forgotPassword",
        templateData: {
            name: `${user.name.firstName} ${user.name.lastName}`,
            resetUILink,
        },
    });
});
exports.forgotPasswordService = forgotPasswordService;
//
const resetPasswordService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email } = req.decoded;
    const { newPassword, id } = req.body;
    if (_id !== id)
        throw new AppError_1.AppError(statusCode_1.default.UNAUTHORIZED, "Unauthorized");
    const user = yield (0, userChecker_1.getExistingUser)({ id: _id });
    user.password = yield (0, bcryptjs_1.hash)(newPassword, env_config_1.default.BCRYPT_SALT_ROUND);
    yield user.save();
    return {
        data: { email },
    };
});
exports.resetPasswordService = resetPasswordService;
//
const setPasswordService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email } = req.decoded;
    const { password } = req.body;
    const user = yield (0, userChecker_1.getExistingUser)({ id: _id, password: true });
    if (user.password) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "You already have a password, try to login or forgot password");
    }
    user.auth = [
        {
            provider: user_interface_1.eAuthProvider.credentials,
            providerId: email,
        },
        ...user.auth,
    ];
    user.password = yield (0, bcryptjs_1.hash)(password, env_config_1.default.BCRYPT_SALT_ROUND);
    yield user.save();
    return {
        data: { _id, email, message: "Password created successfully" },
    };
});
exports.setPasswordService = setPasswordService;
