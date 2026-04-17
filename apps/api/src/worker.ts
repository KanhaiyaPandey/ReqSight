import "dotenv/config";

import { Worker } from "bullmq";

import { redisConnection } from "./config/redis.js";
import { ApiLogJobData } from "./queues/logQueue.js";

const worker = new Worker<ApiLogJobData>(
  "api-logs",
  async (job) => {
    // Placeholder processing step; replace with DB persistence later.
    console.log("Processed log:", job.data);
  },
  {
    connection: redisConnection
  }
);

worker.on("failed", (job, error) => {
  console.error("Log job failed:", job?.id, error);
});

console.log("API log worker started for queue: api-logs");
