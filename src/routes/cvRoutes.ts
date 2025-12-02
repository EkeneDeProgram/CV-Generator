import { Router } from "express";
import { generateCV, previewCV, downloadPDF, downloadDOCX } from "../controllers/cvController";
import { requestLogger } from "../middleware/requestLogger";

const router = Router();

// Attach request logger middleware to all CV routes
router.use(requestLogger);

/**
 * @swagger
 * /api/cv/preview:
 *   post:
 *     summary: Render CV HTML preview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CVData'
 *     responses:
 *       200:
 *         description: HTML CV preview rendered
 */
router.post("/preview", previewCV);

/**
 * @swagger
 * /api/cv/generate:
 *   post:
 *     summary: Generate CV JSON
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CVData'
 *     responses:
 *       200:
 *         description: CV JSON returned
 */
router.post("/generate", generateCV);

/**
 * @swagger
 * /api/cv/download/pdf:
 *   post:
 *     summary: Download CV as PDF
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CVData'
 *     responses:
 *       200:
 *         description: PDF file downloaded
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post("/download/pdf", downloadPDF);

/**
 * @swagger
 * /api/cv/download/docx:
 *   post:
 *     summary: Download CV as DOCX
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CVData'
 *     responses:
 *       200:
 *         description: DOCX file downloaded
 *         content:
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post("/download/docx", downloadDOCX);

export default router;
