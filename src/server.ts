import express from "express";
import config from "./config";
import router from "./routes";

// Create Express app
const app = express();
app.use(express.json({ limit: "6mb" }));
app.use(express.text({ type: "text/html", limit: "6mb" }));

// Use routes
app.use("/", router);

// Simple shutdown
process.on("SIGTERM", (): void => {
  console.log("Shutting down...");
  process.exit(0);
});

process.on("SIGINT", (): void => {
  console.log("Shutting down...");
  process.exit(0);
});

// Start server
app.listen(config.port, (): void => {
  console.log(`PDF renderer listening on :${config.port}`);
});
