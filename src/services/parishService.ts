import { ref, get, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Parish } from "../types/Parish";

export async function getParishById(id: string): Promise<Parish | null> {
    const parishRef = ref(db, `parishes/${id}`);
    const snapshot = await get(parishRef);
    return snapshot.exists() ? snapshot.val() : null;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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

export async function getNearbyParishes(
  latitude: number,
  longitude: number,
  radius: number = 10 // Default radius in kilometers
): Promise<Parish[]> {
  const parishesRef = ref(db, 'parishes');
  const snapshot = await get(parishesRef);
  const parishes: Parish[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const parish = child.val() as Parish;
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
  }
  
  return parishes.sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

export async function createParish(
  data: Omit<Parish, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Parish> {
  const parishRef = push(ref(db, 'parishes'));
  const now = new Date();
  
  const parish: Parish = {
    id: parishRef.key!,
    ...data,
    createdAt: now,
    updatedAt: now
  };

  await set(parishRef, parish);
  return parish;
}