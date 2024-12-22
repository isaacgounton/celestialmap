import { ref, set, get } from 'firebase/database';
import { db } from '../lib/firebase';

export const checkIsAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminRef = ref(db, `admins/${uid}`);
    const snapshot = await get(adminRef);
    return snapshot.exists() && snapshot.val() === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const setAdminStatus = async (uid: string, isAdmin: boolean): Promise<void> => {
  try {
    const adminRef = ref(db, `admins/${uid}`);
    await set(adminRef, isAdmin);
  } catch (error) {
    console.error('Error setting admin status:', error);
    throw new Error('Failed to set admin status');
  }
};
