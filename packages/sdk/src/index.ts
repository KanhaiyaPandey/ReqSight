import axios from "axios";
import { NextFunction, Request, Response } from "express";

export const monitor = (req: Request, res: Response, next: NextFunction): void => {
  // Avoid recursively logging internal queue-ingestion requests.
  if (req.originalUrl === "/log") {
    next();
    return;
  }

  const startTime = performance.now();

  res.on("finish", () => {
    const responseTime = Number((performance.now() - startTime).toFixed(2));

    void axios
      .post("http://localhost:5000/log", {
        method: req.method,
        url: req.originalUrl,
        responseTime,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      })
      .catch((error: unknown) => {
        // Fail silently so logging never blocks the API request lifecycle.
        console.error("Failed to enqueue API log", error);
      });
  });

  next();
};
