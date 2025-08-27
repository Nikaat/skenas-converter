import { Request, Response } from "express";
import { PDFOptions } from "puppeteer";
import { addToQueue } from "./queue";
import { renderPdf } from "./pdf-renderer";
import config from "./config";

export class InvoiceController {
  static healthCheck(req: Request, res: Response): void {
    console.log(`[${new Date().toISOString()}] Health check requested`);

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

    console.log(
      `[${new Date().toISOString()}] Health check completed - Status: ${
        healthStatus.status
      }`
    );
    res.json(healthStatus);
  }

  static async generateInvoice(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substr(2, 9);
    console.log(
      `[${new Date().toISOString()}] [${requestId}] Invoice generation started`
    );

    try {
      const html = req.body;
      const htmlSize = html ? html.length : 0;

      console.log(
        `[${new Date().toISOString()}] [${requestId}] HTML received - Size: ${htmlSize} characters`
      );

      if (!html || typeof html !== "string") {
        console.error(
          `[${new Date().toISOString()}] [${requestId}] Invalid HTML received - Type: ${typeof html}`
        );
        res.status(400).json({
          error: "Missing html string in request body.",
        });
        return;
      }

      if (htmlSize === 0) {
        console.error(
          `[${new Date().toISOString()}] [${requestId}] Empty HTML received`
        );
        res.status(400).json({
          error: "Empty HTML string received.",
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

      console.log(
        `[${new Date().toISOString()}] [${requestId}] Adding to queue with options:`,
        {
          format: invoiceOptions.format,
          printBackground: invoiceOptions.printBackground,
          margin: invoiceOptions.margin,
        }
      );

      const pdfBuffer = await addToQueue(() => renderPdf(html, invoiceOptions));
      const pdfSize = pdfBuffer.length;

      console.log(
        `[${new Date().toISOString()}] [${requestId}] PDF generated successfully - Size: ${pdfSize} bytes`
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');
      res.send(Buffer.from(pdfBuffer));

      console.log(
        `[${new Date().toISOString()}] [${requestId}] Invoice generation completed successfully`
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] [${requestId}] Invoice generation failed:`,
        error
      );
      res.status(500).json({ error: "Invoice PDF generation failed" });
    }
  }
}
