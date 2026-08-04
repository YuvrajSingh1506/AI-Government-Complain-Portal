const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

exports.analyzeComplaint = async ({
    title,
    description,
    imageUrl,
    departments,
}) => {
    try {

        const departmentList = departments
            .map((department) => {
                return `ID: ${department._id}, Name: ${department.name}, Description: ${department.description}`;
            })
            .join("\n");

        const prompt = `
            You are an AI assistant for a Government Complaint Portal.

            Analyze the complaint using BOTH:

            1. Complaint text
            2. Complaint image

            IMPORTANT:

            - Never ignore the image.
            - Never ignore the text.
            - First analyze the image independently.
            - Then analyze the complaint text independently.
            - Compare both analyses.
            - Determine whether they describe the SAME issue.

            If the image and text describe different issues:

            - Set "isMatching" to false.
            - Set confidence below 50.
            - Add a warning.
            - Classify the complaint using the complaint text only.

            Available Departments:

            ${departmentList}

            Complaint Title:
            ${title}

            Complaint Description:
            ${description}

            Department Rules:

            - Select ONLY from the department list.
            - Never invent departments.

            Priority must be exactly one of:

            LOW
            MEDIUM
            HIGH
            CRITICAL

            Return ONLY valid JSON.

            {
                "imageCategory": "",
                "textCategory": "",
                "isMatching": true,
                "confidence": 95,
                "warning": "",
                "category": "",
                "priority": "",
                "department": "",
                "summary": ""
            }
            `;

        const parts = [
            {
                text: prompt,
            },
        ];

        if (imageUrl) {

            const imageResponse = await axios.get(imageUrl, {
                responseType: "arraybuffer",
            });

            const mimeType =
                imageResponse.headers["content-type"] || "image/jpeg";

            const imageData = Buffer.from(imageResponse.data);

            parts.push({
                inlineData: {
                    mimeType,
                    data: imageData.toString("base64"),
                },
            });
        }

        const geminiResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: [
                {
                    role: "user",
                    parts,
                },
            ],
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = geminiResponse.text;

        console.log("Gemini Response:", text);

        return JSON.parse(text);

    } catch (err) {

        console.error("Gemini AI Error:", err);

        throw new Error("Failed to analyze complaint using AI");
    }
};