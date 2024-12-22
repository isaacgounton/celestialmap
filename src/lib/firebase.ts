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

export const addPersonalMapPlace = async (placeData: {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  placeId: string;
}) => {
  const now = new Date();
  const parish: Partial<Parish> = {
    id: `personal_${placeData.placeId}`,
    name: placeData.name,
    address: parseAddressString(placeData.address),
    latitude: placeData.location.lat,
    longitude: placeData.location.lng,
    createdAt: now,
    updatedAt: now,
    importSource: 'manual',
    sourceId: placeData.placeId,
    lastSynced: now.toISOString(),
    leaderName: '',
    phone: '',
    email: '',
    openingHours: {},
    photos: []
  };

  const parishRef = ref(db, `parishes/${parish.id}`);
  await set(parishRef, parish);
  return parish;
};

const parseAddressString = (fullAddress: string) => {
  const parts = fullAddress.split(',').map(part => part.trim());
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    province: parts[2] || '',
    country: parts[parts.length - 1] || '',
    postalCode: '',
  };
};