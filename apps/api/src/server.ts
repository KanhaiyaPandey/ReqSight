import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT ?? 5001);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`API Sentinel backend running on port ${PORT}`);
  });
};

startServer().catch(console.error);
