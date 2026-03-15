import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const envPath = path.resolve(__dirname, '../.env');
  const env = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};
  return {
    plugins: [react()],
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'firebase/app', 
        'firebase/firestore', 
        'firebase/auth', 
        'lucide-react', 
        'react-markdown', 
        'react-syntax-highlighter'
      ],
    },
    define: {
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.APP_FIREBASE_API_KEY || ''),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.APP_FIREBASE_AUTH_DOMAIN || ''),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.APP_FIREBASE_PROJECT_ID || ''),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.APP_FIREBASE_STORAGE_BUCKET || ''),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.APP_FIREBASE_MESSAGING_SENDER_ID || ''),
      'process.env.FIREBASE_APP_ID': JSON.stringify(env.APP_FIREBASE_APP_ID || '')
    }
  }
})
