import { useState, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
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

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported',
        loading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          error: null,
          loading: false
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    );
  }, []);

  const refreshLocation = useCallback(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  // Initial location fetch
  useState(() => {
    getCurrentPosition();
  });

  return {
    ...state,
    refreshLocation
  };
};