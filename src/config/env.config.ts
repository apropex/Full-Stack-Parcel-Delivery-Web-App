import dotenv from "dotenv";
import { EnvRecord, envValidator } from "../app/utils/envValidator";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URL: string;
  FRONTEND_URL: string;
  EXPRESS_SESSION_SECRET: string;
  BCRYPT_SALT_ROUND: number;
  JWT: {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_TOKEN_PERIOD: string;
    JWT_REFRESH_TOKEN_PERIOD: string;
  };
  NODEMAILER: {
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_FROM: string;
    SMTP_PASS: string;
  };
  CLOUDINARY: {
    CLOUD_NAME: string;
    CLOUD_API_KEY: string;
    CLOUD_API_SECRET: string;
  };
  SSL: {
    STORE_ID: string;
    STORE_PASS: string;
    PAYMENT_API: string;
    VALIDATION_API: string;
    SUCCESS_SERVER_URL: string;
    FAIL_SERVER_URL: string;
    CANCEL_SERVER_URL: string;
    SUCCESS_CLIENT_URL: string;
    FAIL_CLIENT_URL: string;
    CANCEL_CLIENT_URL: string;
  };
}

const ENV: EnvConfig = {
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
} as EnvConfig;

// env validator, if env undefined, it returns an error
envValidator(ENV as unknown as Record<string, string | EnvRecord>);

export const isDev = ENV.NODE_ENV === "development";

export default ENV;
