import puppeteer, { PDFOptions } from "puppeteer";
import config from "./config";

export async function renderPdf(
  html: string,
  options: Partial<PDFOptions> = {}
): Promise<Uint8Array> {
  const browser = await puppeteer.launch({
    headless: true,
    args: config.puppeteerArgs,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: config.pageTimeout,
    });

    const pdf = await page.pdf({
      ...config.pdfDefaults,
      ...options,
    });

    await page.close();
    return pdf;
  } finally {
    await browser.close();
  }
}
