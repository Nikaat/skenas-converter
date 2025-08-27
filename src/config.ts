import { PDFOptions } from "puppeteer";

/**
 * Environment Variables:
 * - PORT: Server port (default: 8080)
 * - MAX_CONCURRENT: Maximum concurrent PDF renders (default: 4)
 * - PAGE_TIMEOUT: Page load timeout in milliseconds (default: 45000 - matches client timeout)
 */

interface Config {
  port: number;
  maxConcurrent: number;
  pageTimeout: number;
  puppeteerArgs: string[];
  pdfDefaults: Partial<PDFOptions>;
}

const config: Config = {
  port: parseInt(process.env.PORT || "8080", 10),
  maxConcurrent: parseInt(process.env.MAX_CONCURRENT || "4", 10),
  pageTimeout: parseInt(process.env.PAGE_TIMEOUT || "45000", 10), // Match client timeout
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  pdfDefaults: {
    format: "A5",
    printBackground: true,
  },
};

export default config;
