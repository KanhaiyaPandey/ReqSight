import { Router } from "express";

import { enqueueLog } from "../controllers/log.controller.js";

const router = Router();

router.post("/", enqueueLog);

export default router;
