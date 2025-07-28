import dotenv from "dotenv";
import { EnvRecord, envValidator } from "../app/utils/envValidator";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URL: string;
}

export const ENV: EnvConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URL: process.env.MONGODB_URL,
} as EnvConfig;

// env validator, if env undefined, it returns an error
envValidator(ENV as unknown as Record<string, string | EnvRecord>);

export const isDev = ENV.NODE_ENV === "development";
