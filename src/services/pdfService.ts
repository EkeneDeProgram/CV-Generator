import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";
import { CVData } from "../models/cvTypes";
import path from "path";
import ejs from "ejs";
import fs from "fs";

export const generatePDF = async (data: CVData): Promise<Buffer> => {
  // Load the EJS template file
  const templateFilePath = path.join(__dirname, "../templates", `${data.template}.ejs`);
  const templateContent = fs.readFileSync(templateFilePath, "utf-8");

  // Render HTML from the template
  const htmlContent = ejs.render(templateContent, { data });

  let browser;

  if (process.env.RENDER === "true") {
    // ---------- Production on Render ----------
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath, // chrome-aws-lambda Chromium
      headless: chromium.headless,
    });
  } else {
    // ---------- Local Development ----------
    // Use chrome-aws-lambda for consistency if you want
    let localExecutablePath: string | undefined;

    try {
      // Attempt to detect locally installed Chrome
      const puppeteerLocal = require("puppeteer"); // regular Puppeteer
      const browserInstance = await puppeteerLocal.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      browser = browserInstance;
    } catch (err) {
      // Fallback to chrome-aws-lambda bundled Chromium
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
    }
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "a4",
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
};
