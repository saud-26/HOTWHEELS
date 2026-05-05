import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

function getFirebaseConfig(): FirebaseClientConfig {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const requiredEntries = Object.entries(config).filter(([key]) => key !== "measurementId");
  const missing = requiredEntries
    .filter(([, value]) => !value)
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(
        ", ",
      )}. Add them in Vercel Project Settings > Environment Variables.`,
    );
  }

  return config as FirebaseClientConfig;
}

export function getFirebaseApp() {
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  }

  return app;
}

export function getFirebaseAuth() {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }

  return auth;
}

export function getFirebaseDb() {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }

  return db;
}

export function getFirebaseStorage() {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }

  return storage;
}
