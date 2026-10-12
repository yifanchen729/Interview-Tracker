const { GoogleGenAI } = require("@google/genai");

require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function testGemini() {
    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: "Give me 3 interview tips for a software engineering internship."
    });

    console.log(response.text);
}

testGemini();