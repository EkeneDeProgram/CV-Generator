import path from "path";
import ejs from "ejs";
import pdf from "html-pdf-node";
import { CVData } from "../models/cvTypes";

type TemplateName = "modern" | "card" | "twoColumn";

/**
 * Generates PDF from EJS template using html-pdf-node
 * @param cvData - CV data
 * @param template - template name ("modern" | "card" | "twoColumn")
 * @returns Promise<Buffer> - PDF as buffer
 */
export async function generatePDF(cvData: CVData, template: TemplateName): Promise<Buffer> {
  try {
    // Path to EJS template
    const templatePath = path.join(__dirname, "../templates", `${template}.ejs`);

    // Render HTML from EJS
    const html = await ejs.renderFile(templatePath, { data: cvData });

    // html-pdf-node expects a "file" object
    const file = { content: html };

    // PDF options
    const options = {
      format: "A4",
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      printBackground: true,
    };

    // Generate PDF
    const pdfBuffer = await pdf.generatePdf(file, options);

    return pdfBuffer;
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  }
}
