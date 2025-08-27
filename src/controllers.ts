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
    const requestId = Math.random().toString(36).substr(2, 9);
    console.log(`[${requestId}] Invoice generation started`);

    try {
      const html = req.body;
      const htmlSize = html ? html.length : 0;

      if (!html || typeof html !== "string") {
        console.error(
          `[${requestId}] Invalid HTML received - Type: ${typeof html}`
        );
        res.status(400).json({
          error: "Missing html string in request body.",
        });
        return;
      }

      if (htmlSize === 0) {
        console.error(`[${requestId}] Empty HTML received`);
        res.status(400).json({
          error: "Empty HTML string received.",
        });
        return;
      }

      // Use default settings (matches your config)
      const invoiceOptions: Partial<PDFOptions> = {};

      const pdfBuffer = await addToQueue(() => renderPdf(html, invoiceOptions));
      const pdfSize = pdfBuffer.length;

      console.log(`[${requestId}] PDF generated - ${pdfSize} bytes`);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');
      res.send(Buffer.from(pdfBuffer));

      console.log(`[${requestId}] Invoice generation completed`);
    } catch (error) {
      console.error(`[${requestId}] Invoice generation failed:`, error);
      res.status(500).json({ error: "Invoice PDF generation failed" });
    }
  }
}
