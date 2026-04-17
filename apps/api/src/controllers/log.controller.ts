import { Request, Response } from "express";

import { ApiLogJobData, logQueue } from "../queues/logQueue.js";

const isValidLogPayload = (payload: Partial<ApiLogJobData>): payload is ApiLogJobData => {
  return (
    typeof payload.method === "string" &&
    typeof payload.url === "string" &&
    typeof payload.responseTime === "number" &&
    typeof payload.statusCode === "number" &&
    typeof payload.timestamp === "string"
  );
};

export const enqueueLog = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as Partial<ApiLogJobData>;

  if (!isValidLogPayload(payload)) {
    res.status(400).json({ message: "Invalid log payload" });
    return;
  }

  // Keep request handling fast by delegating processing to the queue worker.
  await logQueue.add("request-log", payload);

  res.status(202).json({ message: "Log queued" });
};
