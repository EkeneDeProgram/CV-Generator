import { CVData, DocxParts } from "../models/cvTypes";
import { Document, Packer, Paragraph, TextRun } from "docx";


// Safely cleans text and detects highlights.
function createTextRun(
    input: string | { text?: string; bold?: boolean } | null | undefined,
    appendComma = false
): TextRun {
    let rawText = "";
    let bold = false;
    let highlight: "yellow" | undefined = undefined;

    if (!input) return new TextRun("");

    if (typeof input === "string") {
        rawText = input.replace(/<[^>]+>/g, "");
        if (input.includes('<span class="highlight">')) highlight = "yellow";
    } else if (typeof input === "object") {
        if (typeof input.text === "string") {
            rawText = input.text.replace(/<[^>]+>/g, "");
            if (input.text.includes('<span class="highlight">')) highlight = "yellow";
            bold = input.bold ?? false;
        } else {
            console.warn("Unexpected input in createTextRun:", input);
            rawText = String(input);
        }
    } else {
        rawText = String(input);
    }

    return new TextRun({
        text: rawText + (appendComma ? ", " : ""),
        bold,
        highlight,
    });
}

/**
 * Generates a DOCX file buffer from CVData.
 */
export const generateDOCX = async (data: CVData): Promise<Buffer> => {
    // ⭐ FIX: Ensure all arrays ALWAYS exist
    const docxParts: DocxParts = {
        summary: data._docxParts?.summary ?? [],
        workExperience: data._docxParts?.workExperience ?? [],
        projects: data._docxParts?.projects ?? [],
        achievements: data._docxParts?.achievements ?? [],
    };

    const doc = new Document({
        sections: [
            {
                children: [
                    // Header Info
                    new Paragraph({ text: data.personalInfo.name, heading: "Heading1" }),
                    new Paragraph({ text: `Email: ${data.personalInfo.email}` }),
                    new Paragraph({ text: `Contact: ${data.personalInfo.contact}` }),

                    // Professional Summary
                    ...(docxParts.summary.length > 0
                        ? [
                              new Paragraph({ text: "Professional Summary", heading: "Heading2" }),
                              new Paragraph({
                                  children: docxParts.summary.map((s) => createTextRun(s)),
                              }),
                          ]
                        : []),

                    // Skills
                    ...(data.skills?.length
                        ? [
                              new Paragraph({
                                  children: [
                                      new TextRun({ text: "Skills: ", bold: true }),
                                      ...data.skills.map((skill: any, i: number) =>
                                          createTextRun(skill, i < data.skills.length - 1)
                                      ),
                                  ],
                              }),
                          ]
                        : []),

                    // Work Experience
                    ...(docxParts.workExperience.length > 0
                        ? [
                              new Paragraph({ text: "Work Experience", heading: "Heading2" }),
                              ...docxParts.workExperience.map((exp: any) =>
                                  new Paragraph({
                                      children: [
                                          ...(exp.role ?? []).map((r: any) => createTextRun(r)),
                                          new TextRun({ text: "\n" }),
                                          ...(exp.description ?? []).map((d: any) =>
                                              createTextRun(d)
                                          ),
                                      ],
                                  })
                              ),
                          ]
                        : []),

                    // Projects
                    ...(docxParts.projects.length > 0
                        ? [
                              new Paragraph({ text: "Projects", heading: "Heading2" }),
                              ...docxParts.projects.map((p: any) =>
                                  new Paragraph({
                                      children: [
                                          ...(p.title ?? []).map((t: any) => createTextRun(t)),
                                          new TextRun({ text: "\n" }),
                                          ...(p.description ?? []).map((d: any) =>
                                              createTextRun(d)
                                          ),
                                      ],
                                  })
                              ),
                          ]
                        : []),

                    // Achievements
                    ...(docxParts.achievements.length > 0
                        ? [
                              new Paragraph({ text: "Achievements", heading: "Heading2" }),
                              ...docxParts.achievements.map((ach: any) =>
                                  new Paragraph({
                                      children: (ach ?? []).map((a: any, i: number) =>
                                          createTextRun(a, i < (ach?.length ?? 0) - 1)
                                      ),
                                  })
                              ),
                          ]
                        : []),
                ],
            },
        ],
    });

    return await Packer.toBuffer(doc);
};
