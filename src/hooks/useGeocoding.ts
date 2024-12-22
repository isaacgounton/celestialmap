import { useCallback } from 'react';

export const useGeocoding = () => {
  const getCountryFromCoordinates = useCallback(async (lat: number, lng: number): Promise<string | null> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng }
      });

      if (response.results.length > 0) {
        const countryComponent = response.results[0].address_components.find(
          component => component.types.includes('country')
        );
        return countryComponent?.short_name || null;
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }, []);

  return { getCountryFromCoordinates };
};
