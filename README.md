# AI Chatbot Web Application

A full-stack production-ready AI Chatbot built with React, Node.js, Express, Firebase Firestore, and Google Gemini API.

## Features
- 🤖 ChatGPT-style conversational UI with Markdown support
- 📱 Fully responsive design (Mobile, Tablet, Desktop)
- ⚡ Real-time responses using Google Gemini API (`gemini-pro`)
- 💾 Persistent chat history stored in Firebase Firestore
- 🎨 Modern UI with TailwindCSS (collapsible sidebar, elegant message bubbles)

## Project Structure
```text
project-root/
├── frontend/             # React app with Tailwind CSS
│   ├── src/components/   # React components (ChatUI, MessageBubble, ChatInput)
│   └── ...
├── backend/              # Express Node.js application
│   ├── server.js         # API Server
│   ├── gemini.js         # GEMINI API connection module
│   └── firebase.js       # Firebase initialization module
├── .env                  # Environment Variables
├── .env.example          # Template for .env
└── package.json          # Root scripts to run both ends
```

## Setup Instructions

### 1. Install Dependencies
Run the following command in the root directory:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
_(On Windows, just rename or copy the file manually)_

### 3. Setup Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Generate an API key.
3. Add it to the `.env` file as `GEMINI_API_KEY`.

### 4. Setup Firebase Firestore
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. In the left sidebar, click on **Build** > **Firestore Database**, and click **Create database**.
4. Start in **Test Mode** (or update security rules later).
5. Go to **Project Settings** (gear icon) > **General**.
6. Scroll down to "Your apps" and add a **Web App** (</> icon).
7. Copy the `firebaseConfig` variables into your `.env` file as their respective `FIREBASE_...` keys.

### 5. Run the Application
Start both the backend and frontend simultaneously:
```bash
npm start
```
- Frontend will run on `http://localhost:5173`
- Backend API will run on `http://localhost:5000`

### Code Quality
- Designed with modular component architectures.
- Built-in error handling and responsive states.
