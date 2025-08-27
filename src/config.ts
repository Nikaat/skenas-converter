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
  puppeteerArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-software-rasterizer",
  ],
  pdfDefaults: {
    format: "A5",
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: "1cm",
      right: "1cm",
      bottom: "1cm",
      left: "1cm",
    },
    displayHeaderFooter: false,
    footerTemplate: "<div></div>",
    headerTemplate: "<div></div>",
  },
};

// Log configuration on load
console.log(`[${new Date().toISOString()}] Config: Loaded configuration:`, {
  port: config.port,
  maxConcurrent: config.maxConcurrent,
  pageTimeout: config.pageTimeout,
  puppeteerArgs: config.puppeteerArgs,
  pdfDefaults: {
    format: config.pdfDefaults.format,
    printBackground: config.pdfDefaults.printBackground,
    margin: config.pdfDefaults.margin,
  },
});

export default config;
