const {GoogleGenAI} = require("@google/genai");
const fs = require("fs");
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})


exports.analyzeComplaint = async({
    title,
    description,
    imagePath,
    imageMimeType,
    departments,
})=>{
    try{
        const departmentList = departments.map((department)=>{
            return `ID: ${department._id}, Name: ${department.name}, Description: ${department.description}`;
        }).join("\n");

                const prompt = `
                    You are an AI assistant for a Government Complaint Portal.

                    Analyze the citizen's complaint using BOTH:
                    1. Complaint text
                    2. Complaint image

                    Your job is to determine:

                    1. Category
                    2. Priority
                    3. Most appropriate government department
                    4. Short summary

                    IMPORTANT RULES:

                    - You MUST select the department from the provided department list.
                    - Do NOT invent a department.
                    - Return the exact department name from the list.
                    - Priority must be exactly one of:
                    LOW
                    MEDIUM
                    HIGH
                    CRITICAL

                    Complaint Title:
                    ${title}

                    Complaint Description:
                    ${description}

                    Available Departments:
                    ${departmentList}

                    Return ONLY valid JSON in this format:

                    {
                        "category": "string",
                        "priority": "LOW | MEDIUM | HIGH | CRITICAL",
                        "department": "exact department name from the provided list",
                        "summary": "short summary of the complaint"
                    }
                    `;
        const parts = [
            {
                text : prompt,
            },
        ];
         if (imagePath && fs.existsSync(imagePath)) {

            const imageData = fs.readFileSync(imagePath);

            parts.push({
                inlineData: {
                    mimeType: imageMimeType || "image/jpeg",
                    data: imageData.toString("base64"),
                },
            });
        }
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents:[
                {
                    role : "user",
                    parts,
                },
            ],
            config:{
                responseMimeType:"application/json",
            },
        });
        const text = response.text;
        console.log("Gemini Response : ",text);
        const result = JSON.parse(text);
        return result;
    }catch(err){

        console.error("Gemini AI Error:", err);

        throw new Error("Failed to analyze complaint using AI");
    }
}