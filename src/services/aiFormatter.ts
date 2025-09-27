import { CVData } from "../models/cvTypes";

// Default keywords (languages, frameworks, soft skills, etc.)
const defaultKeywords = ["JavaScript", "React", "Node.js", "Python", "Leadership"];

// Highlight keywords for HTML
const highlightHTML = (text: string, keywords: string[]): string => {
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b(${kw})\\b`, "gi");
        text = text.replace(regex, `<span class="highlight">$1</span>`);
    });
    return text;
};

// Mark keywords for DOCX
const markKeywordsForDocx = (text: string, keywords: string[]): { parts: (string | { text: string; bold: boolean })[] } => {
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

// Helpers to handle string | string[]
const highlightAny = (input: string | string[], keywords: string[]): string | string[] => {
    if (Array.isArray(input)) {
        return input.map(i => highlightHTML(i, keywords));
    }
    return highlightHTML(input, keywords);
};

const markAnyForDocx = (input: string | string[], keywords: string[]): { parts: (string | { text: string; bold: boolean })[] }[] => {
    if (Array.isArray(input)) {
        return input.map(i => markKeywordsForDocx(i, keywords));
    }
    return [markKeywordsForDocx(input, keywords)];
};

// Main CV formatting function
export const aiFormatCV = (data: CVData, userKeywords: string[] = []) => {
    // Merge default + user-provided keywords (remove duplicates)
    const keywords = Array.from(new Set([...defaultKeywords, ...userKeywords]));

    // Highlight in summary
    if (data.summary) {
        data.summary = highlightHTML(data.summary, keywords);
    }

    // Normalize name and skills
    data.personalInfo.name = data.personalInfo.name.toUpperCase();
    data.skills = Array.from(new Set(data.skills)).sort();

    // Highlight in work experience
    data.workExperience.forEach(exp => {
        exp.description = highlightAny(exp.description, keywords);
        exp.role = highlightHTML(exp.role, keywords);
    });

    // Highlight in projects
    data.projects.forEach(p => {
        p.description = highlightAny(p.description, keywords);
        p.title = highlightHTML(p.title, keywords);
    });

    // Highlight in achievements
    data.achievements = data.achievements.map(a => highlightHTML(a, keywords));

    // Add DOCX metadata
    (data as any)._docxParts = {
        workExperience: data.workExperience.map(exp => ({
            role: markKeywordsForDocx(exp.role, keywords).parts,
            description: markAnyForDocx(exp.description, keywords).map(d => d.parts)
        })),
        projects: data.projects.map(p => ({
            title: markKeywordsForDocx(p.title, keywords).parts,
            description: markAnyForDocx(p.description, keywords).map(d => d.parts)
        })),
        achievements: data.achievements.map(a => markKeywordsForDocx(a, keywords).parts)
    };

    return data;
};
