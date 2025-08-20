import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'dummy-app-id',
};

// Only initialize Firebase if we have valid config (not dummy values)
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (hasValidConfig) {
  // Initialize Firebase
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // Initialize Firebase services
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // Provide dummy objects for build time
  app = null;
  db = null;
  auth = null;
}

export { db, auth };
export default app;
