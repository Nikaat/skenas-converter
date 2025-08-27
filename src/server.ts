import express from "express";
import config from "./config";
import router from "./routes";

// Create Express app
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use(express.json({ limit: "6mb" }));
app.use(express.text({ type: "text/html", limit: "6mb" }));

// Use routes
app.use("/", router);

// Catch-all route for debugging unmatched requests
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Route not found",
    message: `No handler found for ${req.method} ${req.url}`,
    availableRoutes: ["/healthz", "/test", "/render"],
  });
});

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
  console.log(`PDF Renderer Server started on port ${config.port}`);
});
