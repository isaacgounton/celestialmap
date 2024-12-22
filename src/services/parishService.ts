import { ref, get, push, set, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../lib/firebase';
import { Parish, ParishWithDistance } from "../types/Parish";

export async function getParishById(id: string): Promise<Parish | null> {
    const parishRef = ref(db, `parishes/${id}`);
    const snapshot = await get(parishRef);
    return snapshot.exists() ? snapshot.val() : null;
}

// Fix arrow function syntax for calculateDistance
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getNearbyParishes = async (
  latitude: number,
  longitude: number,
  countryCode: string,
  radius = 10 // Default radius in kilometers
): Promise<ParishWithDistance[]> => {
  const parishesRef = ref(db, 'parishes');
  const countryQuery = query(
    parishesRef,
    orderByChild('address/country'),
    equalTo(countryCode)
  );

  const snapshot = await get(countryQuery);
  if (!snapshot.exists()) return [];

  const parishes: ParishWithDistance[] = [];

  Object.entries(snapshot.val()).forEach(([id, data]: [string, any]) => {
    const parish = { id, ...data } as Parish;
    const distance = calculateDistance(
      latitude,
      longitude,
      parish.latitude,
      parish.longitude
    );
    
    if (distance <= radius) {
      parishes.push({
        ...parish,
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      });
    }
  });

  return parishes.sort((a, b) => a.distance - b.distance);
};

export async function createParish(
  data: Omit<Parish, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Parish> {
  const parishRef = push(ref(db, 'parishes'));
  const now = new Date().toISOString();
  
  const parish: Parish = {
    id: parishRef.key!,
    ...data,
    createdAt: now,
    updatedAt: now
  };

  await set(parishRef, parish);
  return parish;
}

export const getParishesByCountry = async (countryCode: string): Promise<Parish[]> => {
  const parishesRef = ref(db, 'parishes');
  const countryQuery = query(
    parishesRef,
    orderByChild('address/country'),
    equalTo(countryCode)
  );

  const snapshot = await get(countryQuery);
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
    id,
    ...data
  }));
};