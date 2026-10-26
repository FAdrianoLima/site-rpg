import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "site-rpg-14fad.firebaseapp.com",
  projectId: "site-rpg-14fad",
  storageBucket: "site-rpg-14fad.firebasestorage.app",
  messagingSenderId: "649693602400",
  appId: "1:649693602400:web:66eea9867f9d4743fc1905",
};

// Reutiliza o app existente em vez de inicializá-lo novamente.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const emailProvider = new EmailAuthProvider();
export const storage = getStorage(app);
