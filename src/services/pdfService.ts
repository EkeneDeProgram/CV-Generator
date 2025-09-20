import puppeteer from "puppeteer";
import { CVData } from "../models/cvTypes";
import path from "path";
import ejs from "ejs"; // EJS renderer
import fs from "fs";

export const generatePDF = async (data: CVData): Promise<Buffer> => {
    // 1️⃣ Load the EJS template file
    const templateFilePath = path.join(__dirname, "../templates", `${data.template}.ejs`);
    const templateContent = fs.readFileSync(templateFilePath, "utf-8");

    // 2️⃣ Render the EJS template into HTML using CV data
    const htmlContent = ejs.render(templateContent, { data });

    // 3️⃣ Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 4️⃣ Set the HTML content to the page
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // 5️⃣ Generate PDF as Buffer
    const pdfBuffer = Buffer.from(await page.pdf({ format: "A4", printBackground: true }));

    // 6️⃣ Close the browser
    await browser.close();

    return pdfBuffer;
};
