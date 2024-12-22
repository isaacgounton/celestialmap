import { Loader } from '@googlemaps/js-api-loader';

let geocoder: google.maps.Geocoder | null = null;

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  version: "weekly",
  libraries: ["places", "geometry", "geocoding"]
});

const initGeocoder = async () => {
  if (!geocoder) {
    try {
      await loader.load();
      geocoder = new google.maps.Geocoder();
    } catch (error) {
      console.error('Failed to initialize Geocoder:', error);
      return null;
    }
  }
  return geocoder;
};

export async function getCountryFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {
    const geocoderInstance = await initGeocoder();
    if (!geocoderInstance) {
      throw new Error('Geocoder initialization failed');
    }

    const response = await geocoderInstance.geocode({
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
}
