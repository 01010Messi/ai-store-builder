import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateContent(prompt, modelName = "gemini-2.5-flash") {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini:", error);
        // Handle 429 explicitly
        if (error.message.includes("429") || error.status === 429) {
            throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        throw new Error("Failed to generate content from AI");
    }
}
