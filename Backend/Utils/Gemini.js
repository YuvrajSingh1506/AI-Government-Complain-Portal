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
                        - Add a warning.
                        - Still classify the complaint primarily using the complaint text.
                        - Reduce confidence.

                        Available Departments:

                        ${departmentList}

                        Complaint Title:
                        ${title}

                        Complaint Description:
                        ${description}

                        Department Rules:

                        - Select ONLY from the department list.
                        - Never invent departments.

                        Priority must be exactly:

                        LOW
                        MEDIUM
                        HIGH
                        CRITICAL

                        Return ONLY valid JSON.

                        {
                            "imageCategory":"",
                            "textCategory":"",
                            "isMatching":true,
                            "confidence":95,
                            "warning":"",
                            "category":"",
                            "priority":"",
                            "department":"",
                            "summary":""
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