import { createContext, useContext, useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

interface LocationContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  userCountry: string | null;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const { location } = useGeolocation();
  const [selectedCountry, setSelectedCountry] = useState('BJ'); // Default to Benin
  const [userCountry, setUserCountry] = useState<string | null>(null);

  useEffect(() => {
    if (location?.countryCode && !userCountry) {
      setUserCountry(location.countryCode);
      setSelectedCountry(location.countryCode);
    }
  }, [location?.countryCode]);

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
