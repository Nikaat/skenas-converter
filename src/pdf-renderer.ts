import puppeteer, { PDFOptions } from "puppeteer";
import config from "./config";

export async function renderPdf(
  html: string,
  options: Partial<PDFOptions> = {}
): Promise<Uint8Array> {
  console.log(
    `[${new Date().toISOString()}] PDF Renderer: Launching browser with args:`,
    config.puppeteerArgs
  );

  const browser = await puppeteer.launch({
    headless: true,
    args: config.puppeteerArgs,
  });

  console.log(
    `[${new Date().toISOString()}] PDF Renderer: Browser launched successfully`
  );

  try {
    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Creating new page`
    );
    const page = await browser.newPage();

    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Setting page content (${
        html.length
      } characters)`
    );
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: config.pageTimeout,
    });
    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Page content set successfully`
    );

    const finalOptions = { ...config.pdfDefaults, ...options };
    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Generating PDF with options:`,
      {
        format: finalOptions.format,
        printBackground: finalOptions.printBackground,
        margin: finalOptions.margin,
      }
    );

    const pdf = await page.pdf(finalOptions);
    console.log(
      `[${new Date().toISOString()}] PDF Renderer: PDF generated successfully (${
        pdf.length
      } bytes)`
    );

    console.log(`[${new Date().toISOString()}] PDF Renderer: Closing page`);
    await page.close();

    return pdf;
  } finally {
    console.log(`[${new Date().toISOString()}] PDF Renderer: Closing browser`);
    await browser.close();
    console.log(`[${new Date().toISOString()}] PDF Renderer: Browser closed`);
  }
}
