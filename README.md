# 📄 CV Generator

A **Node.js + TypeScript CV/Resume generator** that allows users to create, preview, and download professional resumes in multiple modern templates.  
Supports **EJS-based HTML templates**, **PDF/DOCX export**, and **AI-powered keyword formatting** for ATS (Applicant Tracking System) optimization.

---

## 🚀 Features

- 🎨 **Multiple Templates** – Classic, Modern, Creative, Two-Column, Card-Based, and Pro variants.  
- 🖥 **Preview in Browser** – Render resumes dynamically using **EJS templates**.  
- 📑 **Export Options** – Download CV as **PDF** (via Puppeteer) or **DOCX** (via docx library).  
- 🤖 **AI Formatter** – Auto-enhance CV with keywords for ATS compliance.  
- 🔧 **Customizable** – Easily extend with new templates, themes, and font styles.  
- 📡 **REST API Support** – Integrate with any frontend or external service.  
- 🛡 **TypeScript Models** – Strongly typed CV data structure for maintainability.  

---

## 📂 Project Structure

```bash
cv-generator/
├── src/
│ ├── controllers/ # Route handlers (e.g., cvController.ts)
│ ├── models/ # TypeScript interfaces (cvTypes.ts)
│ ├── public/ # Static files (CSS, assets)
│ ├── routes/ # API routes (cvRoutes.ts)
│ ├── services/ # PDF/DOCX generation + AI formatter
│ ├── templates/ # EJS CV templates
│ ├── app.ts # Express app setup
│ ├── server.ts # Server entry point
│ └── swagger.ts # Swagger API documentation
├── package.json
├── tsconfig.json
├── .gitignore
├── .env
└── README.md
```

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cv-generator.git
   cd cv-generator
   ```
2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Environment setup**
    Create a .env file:
    ```bash
    PORT=5000
    ```

4. **Run the server**
    ```bash
    npm run start
    ```


    or with nodemon (if configured):
    ```bash
    npm run dev
    ```

📑 API Endpoints

Base URL: http://localhost:5000
## API Endpoints

| Method | Endpoint            | Description                         |
| ------ | ------------------- | ----------------------------------- |
| POST   | `/cv/preview`       | Preview CV with selected template   |
| POST   | `/cv/generate`      | Generate CV JSON with AI formatting |
| POST   | `/cv/download/pdf`  | Download CV as PDF                  |
| POST   | `/cv/download/docx` | Download CV as DOCX                 |



🖼 Templates

Available templates:

- classic

- modern

- creative

- card-based

- two-column

- modern-pro

- card-based-pro

- two-column-pro

Each template uses EJS + CSS and can be extended/customized inside src/templates/.

🛠 Tech Stack

- Backend: Node.js, Express, TypeScript
- Templating: EJS
- Export: Puppeteer (PDF), docx (Word)
- API Docs: Swagger


📖 Usage Example
```http
POST /cv/preview
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "contact": "+1234567890",
    "address": "123 Main Street"
  },
  "summary": "Software Engineer with 5+ years of backend experience.",
  "workExperience": [
    {
      "company": "Tech Corp",
      "role": "Backend Engineer",
      "startDate": "2021",
      "endDate": "2023",
      "description": "Developed scalable APIs and microservices."
    }
  ],
  "education": [
    {
      "institution": "XYZ University",
      "degree": "B.Sc. Computer Science",
      "startDate": "2017",
      "endDate": "2021"
    }
  ],
  "skills": [
    { "category": "Languages", "items": ["Python", "JavaScript", "TypeScript"] }
  ],
  "achievements": ["Built VisaVision.com project", "Hackathon Finalist"],
  "template": "modern",
  "colorScheme": "blue",
  "fontStyle": "Helvetica"
}
```

📘 Documentation

API documentation is available via Swagger UI:
👉 http://localhost:5000/api-docs


🏗 Future Improvements

- Add user authentication & profile saving
- Cloud storage for CVs (AWS S3 / GCP)
- Drag-and-drop CV builder UI
- More creative CV templates
- Multi-language support


👨‍💻 Author

Ekene Onyekachi
Backend Engineer | Python & Node.js