import { Redis } from "ioredis";

function redisClient() {
  if (process.env.REDIS_URL) {
    console.log("Redis Connected!");
    return process.env.REDIS_URL; // Return the Redis URL
  } else {
    throw new Error("Redis Connection Failed!");
  }
}
export const redis = new Redis(redisClient());
