import { Router } from "express";
import { InvoiceController } from "./controllers";

const router = Router();

// Health check route
router.get("/healthz", InvoiceController.healthCheck);

// Invoice PDF generation route
router.post("/render", InvoiceController.generateInvoice);

export default router;
