import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, collection, addDoc, getDocs, query, orderBy } from './firebase.js';
import { getGeminiResponse, getGeminiStream } from './gemini.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '../.env' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.send('AI Chatbot Backend is running!');
});

// Get chat history
app.get('/chat/history', async (req, res) => {
  if (!db) {
      return res.status(500).json({ error: "Firebase is not configured. Add credentials to .env file." });
  }

  try {
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Send new message via STREAM
app.post('/chat/stream', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Flush headers
        res.flushHeaders?.();

        const stream = await getGeminiStream(message, history || []);
        
        for await (const chunk of stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch(err) {
        console.error("Stream Error:", err);
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
