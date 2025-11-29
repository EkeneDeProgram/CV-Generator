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
      executablePath: await chromium.executablePath, // Chrome provided by chrome-aws-lambda
      headless: chromium.headless,
    });
  } else {
    // ---------- Local Development ----------
    const localPuppeteer = require("puppeteer"); // regular Puppeteer
    browser = await localPuppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "a4", // lowercase for puppeteer
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
};
