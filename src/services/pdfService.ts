import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import { CVData } from "../models/cvTypes";

export const generatePDF = async (data: CVData): Promise<Buffer> => {
  // Load template
  const templateFilePath = path.join(
    __dirname,
    "../templates",
    `${data.template}.ejs`
  );
  const templateContent = fs.readFileSync(templateFilePath, "utf-8");
  const htmlContent = ejs.render(templateContent, { data });

  // Launch local bundled Chromium
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};
