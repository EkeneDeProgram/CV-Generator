import puppeteer from "puppeteer";
import { CVData } from "../models/cvTypes";
import path from "path";
import ejs from "ejs"; 
import fs from "fs";

export const generatePDF = async (data: CVData): Promise<Buffer> => {
    // Load the EJS template file
    const templateFilePath = path.join(__dirname, "../templates", `${data.template}.ejs`);
    const templateContent = fs.readFileSync(templateFilePath, "utf-8");

    // Render the EJS template into HTML using CV data
    const htmlContent = ejs.render(templateContent, { data });

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 4Set the HTML content to the page
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF as Buffer
    const pdfBuffer = Buffer.from(await page.pdf({ format: "A4", printBackground: true }));

    // Close the browser
    await browser.close();

    return pdfBuffer;
};
