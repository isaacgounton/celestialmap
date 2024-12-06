import { ref, get, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import { Parish } from "../types/Parish";

export async function getParishById(id: string): Promise<Parish | null> {
    const parishRef = ref(db, `parishes/${id}`);
    const snapshot = await get(parishRef);
    return snapshot.exists() ? snapshot.val() : null;
}

export async function getNearbyParishes(latitude: number, longitude: number): Promise<Parish[]> {
    // This is a simple implementation. You might want to use geofire-js for more sophisticated geoqueries
    const parishesRef = ref(db, 'parishes');
    const snapshot = await get(parishesRef);
    const parishes: Parish[] = [];
    
    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            const parish = child.val();
            parishes.push(parish);
        });
    }
    
    return parishes;
}