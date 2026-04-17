import { Router } from "express";

import {
  enqueueLog,
  getLogsHandler,
  getMetricsHandler,
  getErrorsHandler,
} from "../controllers/log.controller.js";

const router = Router();

router.post("/", enqueueLog);
router.get("/logs", getLogsHandler);
router.get("/metrics", getMetricsHandler);
router.get("/errors", getErrorsHandler);

export default router;
