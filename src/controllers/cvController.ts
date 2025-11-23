import { Request, Response } from "express";
import { CVData } from "../models/cvTypes";
import { generatePDF } from "../services/pdfService";
import { generateDOCX } from "../services/docxService";
import { aiFormatCV } from "../services/aiFormatter";
import { logger } from "../utils/logger";

// Preview CV
export const previewCV = (req: Request, res: Response) => {
    try {
        const { keywords = [], ...cvData } = req.body;
        const data: CVData = aiFormatCV(cvData, keywords);

        logger.info("CV preview generated successfully.");

        res.render(`${data.template}.ejs`, { data });
    } catch (error: any) {
        logger.error(`Preview CV failed: ${error.message}`);
        res.status(500).json({ error: "Failed to generate CV preview." });
    }
};

// Generate CV JSON
export const generateCV = (req: Request, res: Response) => {
    try {
        const { keywords = [], ...cvData } = req.body;
        const data: CVData = aiFormatCV(cvData, keywords);

        logger.info("CV data processed successfully.");

        res.status(200).json({ message: "CV data processed successfully", data });
    } catch (error: any) {
        logger.error(`Generate CV failed: ${error.message}`);
        res.status(500).json({ error: "Failed to process CV data." });
    }
};

// Download PDF
export const downloadPDF = async (req: Request, res: Response) => {
    try {
        const { keywords = [], ...cvData } = req.body;
        const data: CVData = aiFormatCV(cvData, keywords);
        const pdfBuffer = await generatePDF(data);

        logger.info("CV PDF generated successfully.");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
        res.send(pdfBuffer);
    } catch (error: any) {
        logger.error(`Generate PDF failed: ${error.message}`);
        res.status(500).json({ error: "Failed to generate PDF." });
    }
};

// Download DOCX
export const downloadDOCX = async (req: Request, res: Response) => {
    try {
        const { keywords = [], ...cvData } = req.body;
        const data: CVData = aiFormatCV(cvData, keywords);
        const docxBuffer = await generateDOCX(data);

        logger.info("CV DOCX generated successfully.");

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.setHeader("Content-Disposition", "attachment; filename=cv.docx");
        res.send(docxBuffer);
    } catch (error: any) {
        logger.error(`Generate DOCX failed: ${error.message}`);
        res.status(500).json({ error: "Failed to generate DOCX." });
    }
};
