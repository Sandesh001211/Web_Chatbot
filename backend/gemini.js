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

export const getGeminiStream = async (message, image, history = []) => {
    if (!genAI) throw new Error("GEMINI_API_KEY is missing in .env file.");
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Filter out empty messages
        let safeHistory = history.filter(msg => msg && (msg.content?.trim() !== '' || msg.image));

        // Gemini requires strict alternating `user` -> `model` -> `user`
        // Since React state might have already included the current user message, remove trailing user messages
        if (safeHistory.length > 0 && safeHistory[safeHistory.length - 1].role === 'user') {
            safeHistory.pop();
        }

        // Extremely aggressively ensure alternating roles just in case
        const strictHistory = [];
        let expectedRole = 'user';
        for (const msg of safeHistory) {
            const currentRole = msg.role === 'user' ? 'user' : 'model';
            if (currentRole === expectedRole) {
                let parts = [];
                if (msg.content) {
                    parts.push({ text: msg.content });
                }
                
                if (msg.image) {
                    const matches = msg.image.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
                    if (matches) {
                        parts.push({
                            inlineData: {
                                mimeType: matches[1],
                                data: matches[2]
                            }
                        });
                    }
                }
                
                if (parts.length === 0) parts.push({ text: " " });

                strictHistory.push({
                    role: currentRole,
                    parts: parts
                });
                expectedRole = currentRole === 'user' ? 'model' : 'user';
            }
        }
        
        const chat = model.startChat({ history: strictHistory });
        
        let parts = [];
        if (message) parts.push({ text: message });
        
        if (image) {
            const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
            if (matches) {
                parts.push({
                    inlineData: {
                        mimeType: matches[1],
                        data: matches[2]
                    }
                });
            }
        }
        
        if (parts.length === 0) {
            parts.push({ text: "Please process this request." });
        }
        
        const result = await chat.sendMessageStream(parts);
        return result.stream;
    } catch (error) {
        console.error("Gemini Streaming Stream Error:", error);
        throw new Error("Failed to stream response from AI: " + error.message);
    }
}
