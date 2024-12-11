import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, query, DatabaseReference, push, set, serverTimestamp } from 'firebase/database';
import { Parish } from '../types/Parish';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export const getParishesRef = (): DatabaseReference => ref(db, 'parishes');

export const fetchAllParishes = async (): Promise<Parish[]> => {
    const snapshot = await get(query(getParishesRef()));
    
    if (!snapshot.exists()) return [];
    
    const parishes: Parish[] = [];
    snapshot.forEach((child) => {
        parishes.push({
            id: child.key!,
            ...child.val()
        });
    });
    
    return parishes;
};

export const createParish = async (parishData: Omit<Parish, 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = getDatabase();
  const newParishRef = push(ref(db, 'parishes'));
  
  const parish = {
    ...parishData,
    id: newParishRef.key,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await set(newParishRef, parish);
  return parish;
};