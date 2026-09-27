import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCEFieEA9T8Ijg-U_mxdvchu4xnsrCHWOk",
  authDomain: "ai-based-scholarship-portal.firebaseapp.com",
  databaseURL: "https://ai-based-scholarship-portal-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-based-scholarship-portal",
  storageBucket: "ai-based-scholarship-portal.firebasestorage.app",
  messagingSenderId: "335723314161",
  appId: "1:335723314161:web:5a8b2cd44dcfbef4e8e250",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

export default app;
