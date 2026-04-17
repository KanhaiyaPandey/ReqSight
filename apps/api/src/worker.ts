import "dotenv/config";

import { Worker } from "bullmq";

import { connectDB } from "./config/db.js";
import { createLog } from "./services/log.service.js";
import { redisConnection } from "./config/redis.js";
import { ApiLogJobData } from "./queues/logQueue.js";

const initWorker = async () => {
  await connectDB();

  const worker = new Worker<ApiLogJobData>(
    "api-logs",
    async (job) => {
      console.log("Processing job:", job.id, job.data);
      try {
        // Save log to MongoDB
        const logData = {
          ...job.data,
          timestamp: new Date(job.data.timestamp), // Convert string to Date
        };
        console.log("Saving log data:", logData);
        const savedLog = await createLog(logData);
        console.log("Log saved successfully:", savedLog._id);
      } catch (error) {
        console.error("Error saving log:", error);
        throw error;
      }
    },
    {
      connection: redisConnection,
    },
  );

  worker.on("failed", (job, error) => {
    console.error("Log job failed:", job?.id, error);
  });

  console.log("API log worker started for queue: api-logs");
};

initWorker().catch(console.error);
