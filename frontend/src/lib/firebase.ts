import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCEFieEA9T8Ijg-U_mxdvchu4xnsrCHWOk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ai-based-scholarship-portal.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ai-based-scholarship-portal",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://ai-based-scholarship-portal-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ai-based-scholarship-portal.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "335723314161",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:335723314161:web:5a8b2cd44dcfbef4e8e250",
};

// Initialize Firebase as a singleton instance
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Database = getDatabase(app);

export { app, auth, database };
