import puppeteer, { PDFOptions } from "puppeteer";
import config from "./config";

export async function renderPdf(
  html: string,
  options: Partial<PDFOptions> = {}
): Promise<Uint8Array> {
  let browser;

  try {
    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Getting executable path`
    );

    const executablePath = await puppeteer.executablePath("chrome");
    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Chrome executable path: ${executablePath}`
    );

    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Launching browser with args:`,
      config.puppeteerArgs
    );

    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: config.puppeteerArgs,
    });

    console.log(
      `[${new Date().toISOString()}] PDF Renderer: Browser launched successfully`
    );

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
      waitUntil: "load",
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
    if (browser) {
      console.log(
        `[${new Date().toISOString()}] PDF Renderer: Closing browser`
      );
      await browser.close();
      console.log(`[${new Date().toISOString()}] PDF Renderer: Browser closed`);
    }
  }
}
