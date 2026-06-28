import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generatewithgemini(data){
    const prompt=`

    You are an experienced HR recruiter.

    Write a professional cover letter.
    
    Candidate Name: ${data.name}

    Job Role: ${data.role}

    Company: ${data.company}

    Skills:
    ${data.skills}

    Resume:
    ${data.resumeText || "Not provided"}

    Requirements:
    - Professional tone
    - 300–400 words
    - Address the hiring manager
    - Mention the candidate's skills naturally
    - Do not use markdown
    `;
    
    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
}