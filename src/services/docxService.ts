import { CVData } from "../models/cvTypes";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const generateDOCX = async (data: CVData): Promise<Buffer> => {
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: data.personalInfo.name, heading: "Heading1" }),
                new Paragraph({ text: `Email: ${data.personalInfo.email}` }),
                new Paragraph({ text: `Contact: ${data.personalInfo.contact}` }),
                new Paragraph({ text: "Skills: " + data.skills.join(", ") }),
                
                ...data._docxParts.workExperience.map((exp: any) =>
                    new Paragraph({
                        children: [
                            ...exp.role.map((r: any) =>
                                typeof r === "string" ? new TextRun(r) : new TextRun({ text: r.text, bold: r.bold })
                            ),
                            new TextRun({ text: `\n` }),
                            ...exp.description.map((d: any) =>
                                typeof d === "string" ? new TextRun(d) : new TextRun({ text: d.text, bold: d.bold })
                            )
                        ]
                    })
                ),

                ...data._docxParts.projects.map((p: any) =>
                    new Paragraph({
                        children: [
                            ...p.title.map((t: any) =>
                                typeof t === "string" ? new TextRun(t) : new TextRun({ text: t.text, bold: t.bold })
                            ),
                            new TextRun({ text: `\n` }),
                            ...p.description.map((d: any) =>
                                typeof d === "string" ? new TextRun(d) : new TextRun({ text: d.text, bold: d.bold })
                            )
                        ]
                    })
                ),

                ...data._docxParts.achievements.map((ach: any) =>
                    new Paragraph({
                        children: ach.map((a: any) => typeof a === "string" ? new TextRun(a) : new TextRun({ text: a.text, bold: a.bold }))
                    })
                )
            ]
        }]
    });

    return await Packer.toBuffer(doc);
};
