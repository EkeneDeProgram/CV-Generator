// Basic personal details for the CV owner
export interface PersonalInfo {
    name: string;   
    email: string; 
    contact: string;
    address: string;
    linkedin?: string; 
    github?: string; 
    portfolio?: string;   
    socialLinks?: string[]; 
}

// Work history: jobs, internships, etc.
export interface WorkExperience {
    company: string;
    role: string;  
    startDate: string; 
    endDate?: string;   
    description: string | string[];  
}

// Education history: schools, degrees, certifications
export interface Education {
    institution: string; 
    degree: string;    
    startDate: string;   
    endDate?: string; 
}

// Projects: portfolio work, side projects, case studies
export interface Project {
    title: string; 
    description: string | string[]; 
    link?: string; 
}

// Skills: technical, soft, or categorized
export interface Skill {
    category: string;        // e.g. "Programming Languages", "Frameworks", "Tools"
    items: string[];         // e.g. ["Python", "JavaScript", "C++"]
}


// Extra structured parts for DOCX rendering
export interface DocxParts {
    summary: any[]; 
    workExperience: any[];  
    projects: any[];        
    achievements: any[];    
}

// The complete CV structure that ties everything together
export interface CVData {
    personalInfo: PersonalInfo;
    summary?: string;
    workExperience: WorkExperience[]; 
    education: Education[]; 
    projects: Project[];
    skills: Skill[];                 
    achievements: string[];
    template: "twoColumn-pro" | "modern" | "card"; 
    colorScheme: string;          
    fontStyle: string;  
    _docxParts?: DocxParts;
}

