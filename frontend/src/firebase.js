import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAW4GNtIBtQuT-M8TYyoh_4S6HfZkI0m3s",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "sesgrg-website.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "sesgrg-website",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "sesgrg-website.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "665472144837",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:665472144837:web:f3432c1363adfaccde27ac",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-DT31MZ5G0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;