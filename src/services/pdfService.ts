// import puppeteer from "puppeteer";
// import { CVData } from "../models/cvTypes";
// import path from "path";
// import ejs from "ejs";
// import fs from "fs";

// export const generatePDF = async (data: CVData): Promise<Buffer> => {
//   // Load the EJS template file
//   const templateFilePath = path.join(__dirname, "../templates", `${data.template}.ejs`);
//   const templateContent = fs.readFileSync(templateFilePath, "utf-8");

//   // Render HTML from the template
//   const htmlContent = ejs.render(templateContent, { data });

//   // Launch Puppeteer
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"], // required in many serverless environments
//   });

//   const page = await browser.newPage();

//   // Set HTML content
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   // Generate PDF
//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     printBackground: true,
//   });

//   await browser.close();

//   return Buffer.from(pdfBuffer);
// };



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
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
    executablePath: chromium.executablePath(), // ⬅️ Key part
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
