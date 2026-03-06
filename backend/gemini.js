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
        
        // Filter out empty messages
        let safeHistory = history.filter(msg => msg && msg.content && msg.content.trim() !== '');

        // Gemini requires strict alternating `user` -> `model` -> `user`
        // Since React state might have already included the current user message, remove trailing user messages
        if (safeHistory.length > 0 && safeHistory[safeHistory.length - 1].role === 'user') {
            // Remove the last user message from history, as it's the one being sent to sendMessageStream right now
            safeHistory.pop();
        }

        // Extremely aggressively ensure alternating roles just in case
        const strictHistory = [];
        let expectedRole = 'user';
        for (const msg of safeHistory) {
            const currentRole = msg.role === 'user' ? 'user' : 'model';
            if (currentRole === expectedRole) {
                strictHistory.push({
                    role: currentRole,
                    parts: [{ text: msg.content }]
                });
                expectedRole = currentRole === 'user' ? 'model' : 'user';
            }
        }
        
        const chat = model.startChat({ history: strictHistory });
        const result = await chat.sendMessageStream(message);
        return result.stream;
    } catch (error) {
        console.error("Gemini Streaming Stream Error:", error);
        throw new Error("Failed to stream response from AI: " + error.message);
    }
}
