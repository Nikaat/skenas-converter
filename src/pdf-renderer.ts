import puppeteer, { PDFOptions } from "puppeteer";
import config from "./config";

export async function renderPdf(
  html: string,
  options: Partial<PDFOptions> = {}
): Promise<Uint8Array> {
  let browser;

  try {
    const executablePath = await puppeteer.executablePath("chrome");

    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: config.puppeteerArgs,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    const finalOptions = { ...config.pdfDefaults, ...options };
    const pdf = await page.pdf(finalOptions);

    await page.close();

    return pdf;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
