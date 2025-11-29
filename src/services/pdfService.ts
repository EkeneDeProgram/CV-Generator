import puppeteer from "puppeteer-core";
import { CVData } from "../models/cvTypes";
import path from "path";
import ejs from "ejs";
import fs from "fs";

// Detect if running on Render
const isRender = process.env.RENDER === "true";

export const generatePDF = async (data: CVData): Promise<Buffer> => {
  const templateFilePath = path.join(__dirname, "../templates", `${data.template}.ejs`);
  const templateContent = fs.readFileSync(templateFilePath, "utf-8");

  const htmlContent = ejs.render(templateContent, { data });

  let browser: any;

  if (isRender) {
    // ---------- PRODUCTION (Render) ----------
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,  // Render Chrome
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ],
    });
  } else {
    // ---------- LOCAL DEVELOPMENT ----------
    const puppeteerLocal = require("puppeteer");
    browser = await puppeteerLocal.launch({
      headless: true,
    });
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfUint8 = await page.pdf({
    format: "a4",
    printBackground: true,
  });

  await browser.close();

  // Convert Uint8Array → Buffer to satisfy return type
  return Buffer.from(pdfUint8);
};
