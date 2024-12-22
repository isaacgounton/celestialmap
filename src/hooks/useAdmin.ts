import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        console.log('No user or user ID found');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Checking admin status for user ID:', user.id);
        const adminRef = ref(db, `admins/${user.id}`);
        const snapshot = await get(adminRef);
        const adminValue = snapshot.val();
        console.log('Admin node value:', adminValue);
        setIsAdmin(snapshot.exists() && adminValue === true);
        console.log('Final admin status:', isAdmin);
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
