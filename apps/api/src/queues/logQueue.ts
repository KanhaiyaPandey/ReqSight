import { Queue } from "bullmq";

import { redisConnection } from "../config/redis.js";

export type ApiLogJobData = {
  method: string;
  url: string;
  responseTime: number;
  statusCode: number;
  timestamp: string;
};

export const logQueue = new Queue<ApiLogJobData>("api-logs", {
  connection: redisConnection
});
