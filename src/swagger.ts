// import swaggerJsdoc from "swagger-jsdoc";

// export const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "CV Generator API",
//       version: "1.0.0",
//       description: "API for generating CVs with preview, PDF, and DOCX export",
//     },
//     servers: [
//       {
//         url: "http://localhost:5000",
//         description: "Local server",
//       },
//     ],
//     components: {
//       schemas: {
//         // ✅ Personal Info Schema
//         PersonalInfo: {
//           type: "object",
//           properties: {
//             name: { type: "string" },
//             email: { type: "string" },
//             contact: { type: "string" },
//             address: { type: "string" },
//             linkedin: { type: "string" },
//             github: { type: "string" },
//             portfolio: { type: "string" },
//             socialLinks: {
//               type: "array",
//               items: { type: "string" },
//             },
//           },
//           required: ["name", "email", "contact", "address"],
//         },
//         // ✅ summary schema
//         Sumarry: "string",
//         // ✅ Work Experience Schema
//         WorkExperience: {
//           type: "object",
//           properties: {
//             company: { type: "string" },
//             role: { type: "string" },
//             startDate: { type: "string" },
//             endDate: { type: "string" },
//             description: { type: "string" },
//           },
//           required: ["company", "role", "startDate", "description"],
//         },

//         // ✅ Education Schema
//         Education: {
//           type: "object",
//           properties: {
//             institution: { type: "string" },
//             degree: { type: "string" },
//             startDate: { type: "string" },
//             endDate: { type: "string" },
//           },
//           required: ["institution", "degree", "startDate"],
//         },

//         // ✅ Project Schema
//         Project: {
//           type: "object",
//           properties: {
//             title: { type: "string" },
//             description: { type: "string" },
//             link: { type: "string" },
//           },
//           required: ["title", "description"],
//         },

//         // ✅ Skill Schema
//         Skill: {
//           type: "object",
//           properties: {
//             category: { type: "string" },
//             items: {
//               type: "array",
//               items: { type: "string" },
//             },
//           },
//           required: ["category", "items"],
//         },

//         CVData: {
//           type: "object",
//           properties: {
//             personalInfo: { $ref: "#/components/schemas/PersonalInfo" },
//             sumarry: {
//               type: "string",
//               items: { $ref: "#/components/schemas/Sumarry" },
//             },
//             workExperience: {
//               type: "array",
//               items: { $ref: "#/components/schemas/WorkExperience" },
//             },
//             education: {
//               type: "array",
//               items: { $ref: "#/components/schemas/Education" },
//             },
//             projects: {
//               type: "array",
//               items: { $ref: "#/components/schemas/Project" },
//             },
//             skills: {
//               type: "array",
//               items: { $ref: "#/components/schemas/Skill" },
//             },
//             achievements: {
//               type: "array",
//               items: { type: "string" },
//             },
//             template: {
//               type: "string",
//               enum: ["classic", "modern", "creative"],
//             },
//             colorScheme: { type: "string" },
//             fontStyle: { type: "string" },

//             // ✅ New keywords field
//             keywords: {
//               type: "array",
//               items: { type: "string" },
//               description: "Optional list of keywords to highlight in CV (languages, tools, soft skills, etc.)"
//             },
//           },
//           required: ["personalInfo", "skills", "template"],
//         },
//       },
//     },
//   },
//   apis: ["./src/routes/*.ts"], // Path to route files for annotations
// };

// export const swaggerSpec = swaggerJsdoc(swaggerOptions);

import swaggerJsdoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CV Generator API",
      version: "1.0.0",
      description: "API for generating CVs with preview, PDF, and DOCX export",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        // ✅ Personal Info Schema
        PersonalInfo: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            contact: { type: "string" },
            address: { type: "string" },
            linkedin: { type: "string" },
            github: { type: "string" },
            portfolio: { type: "string" },
            socialLinks: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["name", "email", "contact", "address"],
        },

        // ✅ Summary Schema
        Summary: {
          type: "string",
          description: "Professional summary of the candidate",
        },

        // ✅ Work Experience Schema
        WorkExperience: {
          type: "object",
          properties: {
            company: { type: "string" },
            role: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            description: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } }
              ],
              description: "Job description as text or bullet points",
            },
          },
          required: ["company", "role", "startDate", "description"],
        },

        // ✅ Education Schema
        Education: {
          type: "object",
          properties: {
            institution: { type: "string" },
            degree: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
          },
          required: ["institution", "degree", "startDate"],
        },

        // ✅ Project Schema
        Project: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } }
              ],
              description: "Project description as text or bullet points",
            },
            link: { type: "string" },
          },
          required: ["title", "description"],
        },

        // ✅ Skill Schema
        Skill: {
          type: "object",
          properties: {
            category: { type: "string" },
            items: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["category", "items"],
        },

        // ✅ CVData Schema
        CVData: {
          type: "object",
          properties: {
            personalInfo: { $ref: "#/components/schemas/PersonalInfo" },
            summary: { $ref: "#/components/schemas/Summary" },
            workExperience: {
              type: "array",
              items: { $ref: "#/components/schemas/WorkExperience" },
            },
            education: {
              type: "array",
              items: { $ref: "#/components/schemas/Education" },
            },
            projects: {
              type: "array",
              items: { $ref: "#/components/schemas/Project" },
            },
            skills: {
              type: "array",
              items: { $ref: "#/components/schemas/Skill" },
            },
            achievements: {
              type: "array",
              items: { type: "string" },
            },
            template: {
              type: "string",
              enum: ["classic", "modern", "creative"],
            },
            colorScheme: { type: "string" },
            fontStyle: { type: "string" },

            // ✅ New keywords field
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of keywords to highlight in CV (languages, tools, soft skills, etc.)",
            },
          },
          required: ["personalInfo", "skills", "template"],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to route files for annotations
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
