import { CVData } from "../models/cvTypes";
import { Document, Packer, Paragraph, TextRun } from "docx";


// Helper to safely clean text and detect highlights
function createTextRun(
    input: string | { text?: string; bold?: boolean } | null | undefined,
    appendComma = false
): TextRun {
    let rawText = "";
    let bold = false;
    let highlight: "yellow" | undefined = undefined;

    if (!input) {
        return new TextRun(""); // nothing to render
    }

    if (typeof input === "string") {
        rawText = input.replace(/<[^>]+>/g, "");
        if (input.includes('<span class="highlight">')) {
            highlight = "yellow";
        }
    } else if (typeof input === "object") {
        if (typeof input.text === "string") {
            rawText = input.text.replace(/<[^>]+>/g, "");
            if (input.text.includes('<span class="highlight">')) {
                highlight = "yellow";
            }
            bold = input.bold || false;
        } else {
            // Unexpected object without text
            console.warn("Unexpected input in createTextRun:", input);
            rawText = String(input);
        }
    } else {
        // Catch-all for weird cases (numbers, booleans, etc.)
        console.warn("Invalid input type in createTextRun:", input);
        rawText = String(input);
    }

    return new TextRun({
        text: rawText + (appendComma ? ", " : ""),
        bold,
        highlight,
    });
}

export const generateDOCX = async (data: CVData): Promise<Buffer> => {
    const doc = new Document({
        sections: [
            {
                children: [
                    // Header Info
                    new Paragraph({ text: data.personalInfo.name, heading: "Heading1" }),
                    new Paragraph({ text: `Email: ${data.personalInfo.email}` }),
                    new Paragraph({ text: `Contact: ${data.personalInfo.contact}` }),

                    // Professional Summary
                    ...(data._docxParts.summary && data._docxParts.summary.length
                        ? [
                              new Paragraph({
                                  text: "Professional Summary",
                                  heading: "Heading2",
                              }),
                              new Paragraph({
                                  children: data._docxParts.summary.map((s: any) =>
                                      createTextRun(s)
                                  ),
                              }),
                          ]
                        : []),

                    // Skills
                    ...(data.skills && data.skills.length
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
                    ...(data._docxParts.workExperience &&
                    data._docxParts.workExperience.length
                        ? [
                              new Paragraph({
                                  text: "Work Experience",
                                  heading: "Heading2",
                              }),
                              ...data._docxParts.workExperience.map((exp: any) =>
                                  new Paragraph({
                                      children: [
                                          ...exp.role.map((r: any) => createTextRun(r)),
                                          new TextRun({ text: `\n` }),
                                          ...exp.description.map((d: any) =>
                                              createTextRun(d)
                                          ),
                                      ],
                                  })
                              ),
                          ]
                        : []),

                    // Projects
                    ...(data._docxParts.projects && data._docxParts.projects.length
                        ? [
                              new Paragraph({
                                  text: "Projects",
                                  heading: "Heading2",
                              }),
                              ...data._docxParts.projects.map((p: any) =>
                                  new Paragraph({
                                      children: [
                                          ...p.title.map((t: any) => createTextRun(t)),
                                          new TextRun({ text: `\n` }),
                                          ...p.description.map((d: any) =>
                                              createTextRun(d)
                                          ),
                                      ],
                                  })
                              ),
                          ]
                        : []),

                    // Achievements
                    ...(data._docxParts.achievements &&
                    data._docxParts.achievements.length
                        ? [
                              new Paragraph({
                                  text: "Achievements",
                                  heading: "Heading2",
                              }),
                              ...data._docxParts.achievements.map(
                                  (ach: any) =>
                                      new Paragraph({
                                          children: ach.map((a: any, i: number) =>
                                              createTextRun(
                                                  a,
                                                  i < ach.length - 1 // comma if not last
                                              )
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
