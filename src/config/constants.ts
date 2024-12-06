export const MAPS_CONFIG = {
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  DEFAULT_LOCATION: {
    lat: 6.5244,  // Lagos, Nigeria (default center)
    lng: 3.3792
  },
  DEFAULT_ZOOM: 12,
  PARISH_SEARCH_RADIUS: 50, // in kilometers
  MAP_OPTIONS: {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  }
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 10000
};