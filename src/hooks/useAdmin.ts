import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminRef = ref(db, `admins/${user.uid}`);
        const snapshot = await get(adminRef);
        setIsAdmin(snapshot.val() === true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
