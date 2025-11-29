// import puppeteer from "puppeteer-core";
// import chromium from "chrome-aws-lambda";
// import { CVData } from "../models/cvTypes";
// import path from "path";
// import ejs from "ejs";
// import fs from "fs";

// export const generatePDF = async (data: CVData): Promise<Buffer> => {
//   // Load EJS template
//   const templateFilePath = path.join(__dirname, "../templates", `${data.template}.ejs`);
//   const templateContent = fs.readFileSync(templateFilePath, "utf-8");

//   // Render HTML
//   const htmlContent = ejs.render(templateContent, { data });

//   let browser;

//   if (process.env.RENDER === "true") {
//     // ---------- Render / Production ----------
//     browser = await puppeteer.launch({
//       args: chromium.args,
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath, // chrome-aws-lambda Chromium
//       headless: chromium.headless,
//     });
//   } else {
//     // ---------- Local Development ----------
//     // Use regular puppeteer with locally downloaded Chromium
//     const localPuppeteer = require("puppeteer"); // installed in devDependencies
//     browser = await localPuppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       defaultViewport: null,
//     });
//   }

//   const page = await browser.newPage();
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({
//     format: "a4",
//     printBackground: true,
//   });

//   await browser.close();
//   return Buffer.from(pdfBuffer);
// };




import puppeteer from "puppeteer";
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

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // required in many serverless environments
  });

  const page = await browser.newPage();

  // Set HTML content
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
};
