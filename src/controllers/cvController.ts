// Imports: Express types, CV data model, and service functions
import { Request, Response } from "express";
import { CVData } from "../models/cvTypes";
import { generatePDF } from "../services/pdfService";
import { generateDOCX } from "../services/docxService";
import { aiFormatCV } from "../services/aiFormatter";

// Preview CV: render EJS template for frontend preview
export const previewCV = (req: Request, res: Response) => {
    const { keywords = [], ...cvData } = req.body; // Extract keywords if provided
    const data: CVData = aiFormatCV(cvData, keywords); // Pass keywords to formatter
    res.render(`${data.template}.ejs`, { data }); // Render selected template with CV data
};

// Generate CV: optional backend processing / data validation
export const generateCV = (req: Request, res: Response) => {
    const { keywords = [], ...cvData } = req.body;
    const data: CVData = aiFormatCV(cvData, keywords);
    res.status(200).json({ message: "CV data processed successfully", data });
};

// Download CV as PDF
export const downloadPDF = async (req: Request, res: Response) => {
    const { keywords = [], ...cvData } = req.body;
    const data: CVData = aiFormatCV(cvData, keywords);
    const pdfBuffer = await generatePDF(data);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
    res.send(pdfBuffer);
};

// Download CV as DOCX
export const downloadDOCX = async (req: Request, res: Response) => {
    const { keywords = [], ...cvData } = req.body;
    const data: CVData = aiFormatCV(cvData, keywords);
    const docxBuffer = await generateDOCX(data);
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=cv.docx");
    res.send(docxBuffer);
};
