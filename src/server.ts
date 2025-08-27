import express from "express";
import config from "./config";
import router from "./routes";

// Create Express app
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - Request started`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${
        res.statusCode
      } (${duration}ms)`
    );
  });

  next();
});

app.use(express.json({ limit: "6mb" }));
app.use(express.text({ type: "text/html", limit: "6mb" }));

// Use routes
app.use("/", router);

// Simple shutdown
process.on("SIGTERM", (): void => {
  console.log(
    `[${new Date().toISOString()}] SIGTERM received. Shutting down gracefully...`
  );
  process.exit(0);
});

process.on("SIGINT", (): void => {
  console.log(
    `[${new Date().toISOString()}] SIGINT received. Shutting down gracefully...`
  );
  process.exit(0);
});

// Start server
app.listen(config.port, (): void => {
  console.log(
    `[${new Date().toISOString()}] PDF Renderer Server started successfully`
  );
  console.log(
    `[${new Date().toISOString()}] Listening on port: ${config.port}`
  );
  console.log(
    `[${new Date().toISOString()}] Environment: ${
      process.env.NODE_ENV || "development"
    }`
  );
  console.log(
    `[${new Date().toISOString()}] Max concurrent jobs: ${config.maxConcurrent}`
  );
  console.log(
    `[${new Date().toISOString()}] Page timeout: ${config.pageTimeout}ms`
  );
});
