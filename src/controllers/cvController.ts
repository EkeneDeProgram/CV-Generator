import { Request, Response } from "express";
import { CVData } from "../models/cvTypes";
import { generatePDF } from "../services/pdfService";
import { generateDOCX } from "../services/docxService";
import { aiFormatCV } from "../services/aiFormatter";
import { logger } from "../utils/logger";

// PREVIEW CV (HTML)
export const previewCV = (req: Request, res: Response) => {
  try {
    const { keywords = [], ...cvData } = req.body;
    const data: CVData = aiFormatCV(cvData, keywords);

    logger.info("CV preview rendered successfully.");
    res.render(`${data.template}.ejs`, { data });
  } catch (error: any) {
    logger.error(`Preview CV failed: ${error.message}`);
    res.status(500).json({ error: "Failed to generate CV preview." });
  }
};

// RETURN FORMATTED JSON
export const generateCV = (req: Request, res: Response) => {
  try {
    const { keywords = [], ...cvData } = req.body;
    const data: CVData = aiFormatCV(cvData, keywords);

    logger.info("CV JSON generated successfully.");
    res.status(200).json({ message: "CV processed successfully", data });
  } catch (error: any) {
    logger.error(`Generate CV failed: ${error.message}`);
    res.status(500).json({ error: "Failed to process CV data." });
  }
};

// DOWNLOAD PDF FILE
export const downloadPDF = async (req: Request, res: Response) => {
  try {
    const { keywords = [], ...cvData } = req.body;
    const data: CVData = aiFormatCV(cvData, keywords);

    const template = (data.template as "modern" | "card" | "twoColumn") || "modern";
    const pdfBuffer = await generatePDF(data, template);

    logger.info("CV PDF generated successfully.");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error: any) {
    logger.error(`Generate PDF failed: ${error.message}`);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
};

// DOWNLOAD DOCX FILE
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
    res.setHeader("Content-Length", docxBuffer.length);

    return res.send(docxBuffer); // send raw binary
  } catch (error: any) {
    logger.error(`Generate DOCX failed: ${error.message}`);
    res.status(500).json({ error: "Failed to generate DOCX." });
  }
};
