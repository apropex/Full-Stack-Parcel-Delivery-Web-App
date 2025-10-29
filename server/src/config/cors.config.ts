import { CorsOptions } from "cors";
import ENV from "./env.config";

export const corsConfig: CorsOptions = {
  origin: ENV.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};
