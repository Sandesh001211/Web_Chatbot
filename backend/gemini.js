import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });
dotenv.config();

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export const getGeminiResponse = async (message) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is missing in .env file.");
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get response from AI: " + error.message);
  }
};

export const getGeminiStream = async (message, history = []) => {
    if (!genAI) throw new Error("GEMINI_API_KEY is missing in .env file.");
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        // Map history to Gemini API format
        const formattedHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
        
        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessageStream(message);
        return result.stream;
    } catch (error) {
        console.error("Gemini Streaming Stream Error:", error);
        throw new Error("Failed to stream response from AI: " + error.message);
    }
}
