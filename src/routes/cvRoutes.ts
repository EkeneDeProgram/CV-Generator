import { Router } from "express";
import { generateCV, previewCV, downloadPDF, downloadDOCX } from "../controllers/cvController";

const router = Router();

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
 */
router.post("/download/docx", downloadDOCX);

export default router;
