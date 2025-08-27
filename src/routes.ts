import { Router } from "express";
import { InvoiceController } from "./controllers";

const router = Router();

console.log(`[${new Date().toISOString()}] Routes: Setting up routes...`);

// Health check route
router.get("/healthz", InvoiceController.healthCheck);
console.log(`[${new Date().toISOString()}] Routes: Registered GET /healthz`);

// Test route for debugging
router.get("/test", (req, res) => {
  console.log(`[${new Date().toISOString()}] Routes: Test route called`);
  res.json({
    message: "Test route working",
    timestamp: new Date().toISOString(),
  });
});
console.log(`[${new Date().toISOString()}] Routes: Registered GET /test`);

// Invoice PDF generation route
router.post("/render", InvoiceController.generateInvoice);
console.log(`[${new Date().toISOString()}] Routes: Registered POST /render`);

console.log(
  `[${new Date().toISOString()}] Routes: All routes registered successfully`
);

export default router;
