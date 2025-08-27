import { Request, Response } from "express";
import { PDFOptions } from "puppeteer";
import { addToQueue } from "./queue";
import { renderPdf } from "./pdf-renderer";
import config from "./config";

export class InvoiceController {
  static healthCheck(req: Request, res: Response): void {
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: "1.0.0",
      service: "Invoice PDF Renderer",
      config: {
        port: config.port,
        maxConcurrent: config.maxConcurrent,
        pageTimeout: config.pageTimeout,
      },
    };
    res.json(healthStatus);
  }

  static async generateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const html = req.body;

      if (!html || typeof html !== "string") {
        res.status(400).json({
          error: "Missing html string in request body.",
        });
        return;
      }

      // Optimized settings for invoice PDFs
      const invoiceOptions: Partial<PDFOptions> = {
        format: "A5",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "0.5cm",
          right: "0.5cm",
          bottom: "0.5cm",
          left: "0.5cm",
        },
        displayHeaderFooter: false,
      };

      const pdfBuffer = await addToQueue(() => renderPdf(html, invoiceOptions));

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error("Invoice generation failed:", error);
      res.status(500).json({ error: "Invoice PDF generation failed" });
    }
  }
}
