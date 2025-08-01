"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envValidator_1 = require("../app/utils/envValidator");
dotenv_1.default.config();
const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URL: process.env.MONGODB_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
    JWT: {
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_TOKEN_PERIOD: process.env.JWT_TOKEN_PERIOD,
        JWT_REFRESH_TOKEN_PERIOD: process.env.JWT_REFRESH_TOKEN_PERIOD,
    },
    NODEMAILER: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: Number(process.env.SMTP_PORT),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_FROM: process.env.SMTP_FROM,
        SMTP_PASS: process.env.SMTP_PASS,
    },
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUD_NAME,
        CLOUD_API_KEY: process.env.CLOUD_API_KEY,
        CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    },
    SSL: {
        STORE_ID: process.env.STORE_ID,
        STORE_PASS: process.env.STORE_PASS,
        PAYMENT_API: process.env.PAYMENT_API,
        VALIDATION_API: process.env.VALIDATION_API,
        SUCCESS_SERVER_URL: process.env.SUCCESS_SERVER_URL,
        FAIL_SERVER_URL: process.env.FAIL_SERVER_URL,
        CANCEL_SERVER_URL: process.env.CANCEL_SERVER_URL,
        SUCCESS_CLIENT_URL: process.env.SUCCESS_CLIENT_URL,
        FAIL_CLIENT_URL: process.env.FAIL_CLIENT_URL,
        CANCEL_CLIENT_URL: process.env.CANCEL_CLIENT_URL,
    },
    REDIS: {
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASS: process.env.REDIS_PASS,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: Number(process.env.REDIS_PORT),
    },
    GOOGLE: {
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    },
};
// env validator, if env undefined, it returns an error
(0, envValidator_1.envValidator)(ENV);
exports.isDev = ENV.NODE_ENV === "development";
exports.default = ENV;
