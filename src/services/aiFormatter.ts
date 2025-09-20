import { CVData } from "../models/cvTypes";

const keywords = ["JavaScript", "React", "Node.js", "Python", "Leadership"]; // Example

// Highlight keywords for HTML
const highlightHTML = (text: string): string => {
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b(${kw})\\b`, "gi");
        text = text.replace(regex, `<span class="highlight">$1</span>`);
    });
    return text;
};

// Mark keywords for DOCX
const markKeywordsForDocx = (text: string): { parts: (string | { text: string; bold: boolean })[] } => {
    let parts: (string | { text: string; bold: boolean })[] = [];
    let lastIndex = 0;
    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push({ text: match[0], bold: true });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return { parts };
};

export const aiFormatCV = (data: CVData) => {
    data.personalInfo.name = data.personalInfo.name.toUpperCase();
    data.skills = Array.from(new Set(data.skills)).sort();

    // Highlight HTML
    data.workExperience.forEach(exp => {
        exp.description = highlightHTML(exp.description);
        exp.role = highlightHTML(exp.role);
    });

    data.projects.forEach(p => {
        p.description = highlightHTML(p.description);
        p.title = highlightHTML(p.title);
    });

    data.achievements = data.achievements.map(a => highlightHTML(a));

    // Add DOCX metadata
    (data as any)._docxParts = {
        workExperience: data.workExperience.map(exp => ({
            role: markKeywordsForDocx(exp.role).parts,
            description: markKeywordsForDocx(exp.description).parts
        })),
        projects: data.projects.map(p => ({
            title: markKeywordsForDocx(p.title).parts,
            description: markKeywordsForDocx(p.description).parts
        })),
        achievements: data.achievements.map(a => markKeywordsForDocx(a).parts)
    };

    return data;
};
