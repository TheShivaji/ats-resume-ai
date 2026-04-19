import Groq from "groq-sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

// 1. Initialize Groq correctly
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// 2. Define Schemas (Tera code ekdum sahi tha yahan)
const interviewReportSchema = z.object({
    matchScore: z.number().describe("Score between 0 and 100"),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string(),
});

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
    // 3. Groq ko strictly JSON schema follow karne ke liye prompt mein batana padta hai
    const jsonSchemaString = JSON.stringify(zodToJsonSchema(interviewReportSchema), null, 2);

    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}
        
        CRITICAL: You must return ONLY a raw JSON object that strictly adheres to the following JSON schema. Do not include markdown formatting like \`\`\`json.
        Schema:
        ${jsonSchemaString}
    `;

    const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
        response_format: { type: "json_object" }, // 🔥 Yeh enforce karega ki output JSON hi ho
    });

    return JSON.parse(response.choices[0].message.content);
};

// 4. Puppeteer Logic (No changes needed, ekdum sahi tha)
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4", 
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });

    await browser.close();
    return pdfBuffer;
}

export const generateResumePdf = async ({ resume, selfDescription, jobDescription }) => {
    const resumePdfSchema = z.object({
        html: z.string()
    });

    const jsonSchemaString = JSON.stringify(zodToJsonSchema(resumePdfSchema), null, 2);

    const prompt = `Generate resume for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        CRITICAL: You must return ONLY a raw JSON object with a single field "html". Do not include markdown formatting like \`\`\`json.
        Schema:
        ${jsonSchemaString}

        Tailor the resume for the job description. The HTML should be well-formatted, professional, ATS-friendly, and 1-2 pages long.
    `;

    const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
        response_format: { type: "json_object" },
    });

    const jsonContent = JSON.parse(response.choices[0].message.content);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
};