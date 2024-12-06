import { useState, useEffect } from 'react';
import { getCurrentLocation } from '../utils/location';

interface UseGeolocationReturn {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  error: string | null;
  loading: boolean;
  refreshLocation: () => Promise<void>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return {
    location,
    error,
    loading,
    refreshLocation
  };
}