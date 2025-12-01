import { CVData, DocxParts } from "../models/cvTypes";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

// Utility: convert any input to TextRun[]
function toRuns(value: any, appendComma = false): TextRun[] {
  if (value === null || value === undefined) return [new TextRun("")];

  if (Array.isArray(value)) {
    return value
      .map((item, idx) => toRuns(item, appendComma && idx < value.length - 1))
      .flat();
  }

  let text = "";
  let bold = false;
  let highlight: "yellow" | undefined;

  // Handle object with text and bold
  if (typeof value === "object") {
    // Check for grouped skills
    if ("category" in value && Array.isArray(value.items)) {
      text = `${value.category}: ${value.items.join(", ")}`;
      bold = true;
    } else if ("text" in value) {
      text = sanitize(value.text);
      bold = Boolean(value.bold);
      if (value.text.includes('<span class="highlight">')) highlight = "yellow";
    } else {
      // Fallback
      text = sanitize(JSON.stringify(value));
    }
  } else if (typeof value === "string") {
    text = sanitize(value);
    if (value.includes('<span class="highlight">')) highlight = "yellow";
  } else {
    text = sanitize(String(value));
  }

  return [
    new TextRun({
      text: text + (appendComma ? ", " : ""),
      bold,
      highlight,
    }),
  ];
}

// Remove HTML tags
function sanitize(str: string): string {
  return str.replace(/<[^>]+>/g, "");
}

// Create section heading
function sectionHeading(text: string): Paragraph {
  return new Paragraph({ text, heading: "Heading2" });
}

// Create bullet list from array
function bulletListFromArray(items: any[]): Paragraph[] {
  return items.map((item) =>
    new Paragraph({
      children: toRuns(item),
      bullet: { level: 0 },
      spacing: { after: 200 },
    })
  );
}

// DOCX Generation
export const generateDOCX = async (data: CVData): Promise<Buffer> => {
  const parts: DocxParts = {
    summary: data._docxParts?.summary ?? [],
    workExperience: data._docxParts?.workExperience ?? [],
    projects: data._docxParts?.projects ?? [],
    achievements: data._docxParts?.achievements ?? [],
  };

  const children: Paragraph[] = [];

  // PERSONAL INFO
  children.push(
    
    // Name as Heading1
    new Paragraph({ text: data.personalInfo.name, heading: "Heading1" }),

    // Contact info block
    new Paragraph({ text: `Email: ${data.personalInfo.email}` }),
    new Paragraph({ text: `Contact: ${data.personalInfo.contact}` }),

    // Address
    new Paragraph({ text: `Address: ${data.personalInfo.address}` }),

    // Optional links (only if they exist)
    ...(data.personalInfo.linkedin
        ? [new Paragraph({ text: `LinkedIn: ${data.personalInfo.linkedin}` })]
        : []),
    ...(data.personalInfo.github
        ? [new Paragraph({ text: `GitHub: ${data.personalInfo.github}` })]
        : []),
    ...(data.personalInfo.portfolio
        ? [new Paragraph({ text: `Portfolio: ${data.personalInfo.portfolio}` })]
        : []),

    // Optional social links array
    ...(data.personalInfo.socialLinks && data.personalInfo.socialLinks.length
        ? [
            new Paragraph({
            text: `Social Links: ${data.personalInfo.socialLinks.join(", ")}`,
            }),
        ]
        : [])
  );

  // PROFESSIONAL SUMMARY
  if (parts.summary.length > 0) {
    children.push(sectionHeading("Professional Summary"));
    children.push(...bulletListFromArray(parts.summary));
  }

  // SKILLS
  if (data.skills?.length) {
    children.push(sectionHeading("Skills"));
    data.skills.forEach((skill) => {
      children.push(...toRuns(skill).map((tr) => new Paragraph({ children: [tr] })));
    });
  }

  // WORK EXPERIENCE
  if (parts.workExperience.length > 0) {
    children.push(sectionHeading("Work Experience"));
    parts.workExperience.forEach((exp) => {
      if (exp.role || exp.company) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${exp.role} @ ${exp.company}`, bold: true }),
            ],
          })
        );
      }
      if (exp.description) {
        children.push(...bulletListFromArray(exp.description));
      }
    });
  }

  // PROJECTS
  if (parts.projects.length > 0) {
    children.push(sectionHeading("Projects"));
    parts.projects.forEach((proj) => {
      if (proj.title) {
        children.push(new Paragraph({ children: toRuns(proj.title) }));
      }
      if (proj.description) {
        children.push(...bulletListFromArray(proj.description));
      }
    });
  }

  // ACHIEVEMENTS
  if (parts.achievements.length > 0) {
    children.push(sectionHeading("Achievements"));
    children.push(...bulletListFromArray(parts.achievements));
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBuffer(doc);
};
