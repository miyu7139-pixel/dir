import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// User's provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDxZhJJTJi_4rxzJ3Tenw7t7exyhqWF1Ys",
  authDomain: "visit-6bded.firebaseapp.com",
  projectId: "visit-6bded",
  storageBucket: "visit-6bded.firebasestorage.app",
  messagingSenderId: "408845069363",
  appId: "1:408845069363:web:d14913d5aa1b0c090ec746"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Attempt anonymous sign-in in background for authenticated Firestore access
signInAnonymously(auth).catch((err) => {
  console.info("Anonymous sign-in skipped or restricted, continuing with public Firestore rules or local cache:", err.message);
});
