import dotenv from "dotenv";
import { EnvRecord, envValidator } from "../app/utils/envValidator";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URL: string;
  JWT: {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_TOKEN_PERIOD: string;
    JWT_REFRESH_TOKEN_PERIOD: string;
  };
}

const ENV: EnvConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_TOKEN_PERIOD: process.env.JWT_TOKEN_PERIOD,
    JWT_REFRESH_TOKEN_PERIOD: process.env.JWT_REFRESH_TOKEN_PERIOD,
  },
} as EnvConfig;

// env validator, if env undefined, it returns an error
envValidator(ENV as unknown as Record<string, string | EnvRecord>);

export const isDev = ENV.NODE_ENV === "development";

export default ENV;
