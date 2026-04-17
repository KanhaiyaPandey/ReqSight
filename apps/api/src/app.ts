import cors from "cors";
import express from "express";

import { monitor } from "@repo/sdk";
import healthRoutes from "./routes/health.routes.js";
import logRoutes from "./routes/log.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(monitor);

app.use("/health", healthRoutes);
app.use("/log", logRoutes);

export default app;
