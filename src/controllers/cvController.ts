// Imports: Express types, CV data model, and service functions
import { Request, Response } from "express";
import { CVData } from "../models/cvTypes";
import { generatePDF } from "../services/pdfService";
import { generateDOCX } from "../services/docxService";
import { aiFormatCV } from "../services/aiFormatter";


// Preview CV: render EJS template for frontend preview
export const previewCV = (req: Request, res: Response) => {
    const data: CVData = aiFormatCV(req.body); // Format CV data using AI formatter
    res.render(`${data.template}.ejs`, { data }); // Render selected template with CV data
};


// Generate CV: optional backend processing / data validation
export const generateCV = (req: Request, res: Response) => {
    const data: CVData = aiFormatCV(req.body); // Format CV data
    res.status(200).json({ message: "CV data processed successfully", data }); // Send processed data as JSON
};


// Download CV as PDF
export const downloadPDF = async (req: Request, res: Response) => {
    const data: CVData = aiFormatCV(req.body);         // Format CV data
    const pdfBuffer = await generatePDF(data);        // Generate PDF as a buffer
    res.setHeader("Content-Type", "application/pdf"); // Set content type for PDF
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf"); // Force file download with name
    res.send(pdfBuffer);                              // Send the PDF buffer to client
};


// Download CV as DOCX
export const downloadDOCX = async (req: Request, res: Response) => {
    const data: CVData = aiFormatCV(req.body); // Format CV data
    const docxBuffer = await generateDOCX(data); // Generate DOCX as a buffer
    // Set content type for Word document
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=cv.docx"); // Force file download with name
    res.send(docxBuffer); // Send the DOCX buffer to client
};
