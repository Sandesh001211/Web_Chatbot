import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import dotenv from "dotenv";

// Also support running from the root or the backend folder
dotenv.config({ path: '../.env' });
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.APP_FIREBASE_API_KEY,
  authDomain: process.env.APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.APP_FIREBASE_APP_ID
};

// Only initialize if config is present to avoid crashing if user hasn't set env vars yet
let app;
let db;
try {
  if (process.env.APP_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase config is missing. Firestore will not work.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, collection, addDoc, getDocs, query, orderBy };
