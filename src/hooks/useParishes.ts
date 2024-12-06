
import { useState, useEffect } from 'react';
import { fetchAllParishes } from '../lib/firebase';
import { Parish } from '../types/Parish';

export function useParishes() {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadParishes = async () => {
      try {
        setLoading(true);
        const fetchedParishes = await fetchAllParishes();
        setParishes(fetchedParishes);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch parishes'));
        console.error('Error loading parishes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadParishes();
  }, []);

  const refreshParishes = async () => {
    setLoading(true);
    try {
      const fetchedParishes = await fetchAllParishes();
      setParishes(fetchedParishes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch parishes'));
      console.error('Error refreshing parishes:', err);
    } finally {
      setLoading(false);
    }
  };

  return { parishes, loading, error, refreshParishes };
}