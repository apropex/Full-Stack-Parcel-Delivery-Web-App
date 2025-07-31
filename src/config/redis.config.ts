import { createClient } from "redis";
import logger from "../app/lib/logger";
import ENV from "./env.config";

const REDIS = ENV.REDIS;

export const redisClient = createClient({
  username: REDIS.REDIS_USERNAME,
  password: REDIS.REDIS_PASS,
  socket: {
    host: REDIS.REDIS_HOST,
    port: REDIS.REDIS_PORT,
  },
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) await redisClient.connect();
};
