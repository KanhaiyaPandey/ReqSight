import { Redis } from "ioredis";

const redisHost = process.env.REDIS_HOST ?? "localhost";
const redisPort = Number(process.env.REDIS_PORT ?? 6379);

// Shared Redis connection used by queue and worker.
export const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null
});
