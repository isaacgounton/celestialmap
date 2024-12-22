import { createContext, useContext, useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useGeocoding } from '../hooks/useGeocoding';

interface LocationContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  userCountry: string | null;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const { location } = useGeolocation();
  const { getCountryFromCoordinates } = useGeocoding();
  const [selectedCountry, setSelectedCountry] = useState('BJ'); // Default to Benin
  const [userCountry, setUserCountry] = useState<string | null>(null);

  useEffect(() => {
    const updateUserCountry = async () => {
      if (location?.latitude && location?.longitude && !userCountry) {
        const country = await getCountryFromCoordinates(location.latitude, location.longitude);
        if (country) {
          setUserCountry(country);
          setSelectedCountry(country);
        }
      }
    };

    updateUserCountry();
  }, [location?.latitude, location?.longitude, getCountryFromCoordinates]);

  return (
    <LocationContext.Provider value={{ selectedCountry, setSelectedCountry, userCountry }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
