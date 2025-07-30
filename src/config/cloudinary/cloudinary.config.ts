import { v2 } from "cloudinary";
import ENV from "../env.config";

const CLOUD = ENV.CLOUDINARY;

v2.config({
  cloud_name: CLOUD.CLOUD_NAME,
  api_key: CLOUD.CLOUD_API_KEY,
  api_secret: CLOUD.CLOUD_API_SECRET,
});

export const cloudinary = v2;
