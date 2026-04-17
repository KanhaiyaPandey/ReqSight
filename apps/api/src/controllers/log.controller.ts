import { Request, Response } from "express";

import { ApiLogJobData, logQueue } from "../queues/logQueue.js";
import {
  getLogs,
  getMetrics,
  getErrors,
  LogFilters,
  PaginationOptions,
} from "../services/log.service.js";

const isValidLogPayload = (
  payload: Partial<ApiLogJobData>,
): payload is ApiLogJobData => {
  return (
    typeof payload.method === "string" &&
    typeof payload.url === "string" &&
    typeof payload.responseTime === "number" &&
    typeof payload.statusCode === "number" &&
    typeof payload.timestamp === "string"
  );
};

export const enqueueLog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = req.body as Partial<ApiLogJobData>;

  if (!isValidLogPayload(payload)) {
    res.status(400).json({ message: "Invalid log payload" });
    return;
  }

  // Keep request handling fast by delegating processing to the queue worker.
  await logQueue.add("request-log", payload);

  res.status(202).json({ message: "Log queued" });
};

export const getLogsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const filters: LogFilters = {
      method: req.query.method as string,
      url: req.query.url as string,
      statusCode: req.query.statusCode
        ? Number(req.query.statusCode)
        : undefined,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    };

    const pagination: PaginationOptions = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    };

    const { logs, total } = await getLogs(filters, pagination);

    res.json({
      logs,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit!),
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMetricsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const metrics = await getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getErrorsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pagination: PaginationOptions = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    };

    const { errors, total } = await getErrors(pagination);

    res.json({
      errors,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit!),
      },
    });
  } catch (error) {
    console.error("Error fetching errors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
