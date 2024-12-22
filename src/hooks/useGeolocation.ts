import { useState, useCallback } from 'react';
import { getCountryFromCoordinates } from '../utils/geocoding';

interface Location {
  latitude: number;
  longitude: number;
  countryCode?: string; // Changed from string | null to string | undefined
}

interface GeolocationState {
  location: Location | null;
  error: string | null;
  loading: boolean;
}

export interface UseGeolocation extends GeolocationState {
  refreshLocation: () => void;
}

export const useGeolocation = (): UseGeolocation => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true
  });

  const getCurrentPosition = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported',
        loading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const countryCode = await getCountryFromCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );

      setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          countryCode: countryCode || undefined // Convert null to undefined
        },
        error: null,
        loading: false
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Location error',
        loading: false
      }));
    }
  }, []);

  const refreshLocation = useCallback(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  // Initial location fetch using useState callback
  useState(() => {
    getCurrentPosition();
  });

  return {
    ...state,
    refreshLocation
  };
};