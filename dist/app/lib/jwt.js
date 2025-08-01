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
exports.generateAccessTokenByRefreshToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateAllTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../../config/env.config"));
const AppError_1 = require("../../errors/AppError");
const statusCode_1 = __importDefault(require("../../statusCode"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const jwtPayloadGenerator_1 = require("../utils/jwtPayloadGenerator");
// Environment validation
const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_PERIOD, JWT_REFRESH_TOKEN_PERIOD, } = env_config_1.default.JWT;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables");
}
// Token signing function
const signToken = (payload, secret, expiresIn) => {
    try {
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    }
    catch (_a) {
        throw new AppError_1.AppError(statusCode_1.default.UNAUTHORIZED, "Failed to sign token");
    }
};
// Access token generator
const generateAccessToken = (data, period) => {
    const payload = (0, jwtPayloadGenerator_1.jwtPayloadGenerator)(data);
    return signToken(payload, JWT_SECRET, period || JWT_TOKEN_PERIOD);
};
exports.generateAccessToken = generateAccessToken;
// Refresh token generator
const generateRefreshToken = (data) => {
    const payload = (0, jwtPayloadGenerator_1.jwtPayloadGenerator)(data);
    return signToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_TOKEN_PERIOD);
};
exports.generateRefreshToken = generateRefreshToken;
// Sign both tokens
const generateAllTokens = (data, period) => {
    return {
        accessToken: (0, exports.generateAccessToken)(data, period),
        refreshToken: (0, exports.generateRefreshToken)(data),
    };
};
exports.generateAllTokens = generateAllTokens;
// Generic verifier
const verify = (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === "string" || !decoded) {
            throw new AppError_1.AppError(statusCode_1.default.UNAUTHORIZED, "Invalid token structure");
        }
        return decoded;
    }
    catch (_a) {
        throw new AppError_1.AppError(statusCode_1.default.UNAUTHORIZED, "Invalid or expired token");
    }
};
// Verify access token
const verifyAccessToken = (token) => verify(token, JWT_SECRET);
exports.verifyAccessToken = verifyAccessToken;
// Verify refresh token
const verifyRefreshToken = (token) => verify(token, JWT_REFRESH_SECRET);
exports.verifyRefreshToken = verifyRefreshToken;
// Access token from refresh
const generateAccessTokenByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, exports.verifyRefreshToken)(refreshToken);
    if (!decoded._id) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "Refresh token is missing user ID");
    }
    const user = yield user_model_1.User.findById(decoded._id);
    if (!user)
        throw new AppError_1.AppError(statusCode_1.default.NOT_FOUND, "User does not exist");
    if (user.isActive === user_interface_1.eIsActive.BLOCKED || user.isDeleted)
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, `User is ${user.isDeleted ? "deleted" : "blocked"}`);
    return (0, exports.generateAccessToken)(user);
});
exports.generateAccessTokenByRefreshToken = generateAccessTokenByRefreshToken;
