import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../../hooks/useGeolocation';
import { GoogleMap } from '../map/GoogleMap';
import { LocationMarker } from '../map/LocationMarker';
import { TopParishes } from '../parishes/TopParishes';
import { MAPS_CONFIG } from '../../config/constants';
import { Parish } from '../../types/Parish';
import { fetchAllParishes } from '../../lib/firebase';

export function Home() {
  const navigate = useNavigate();
  const { location, loading: geoLoading, error: geoError, refreshLocation } = useGeolocation();
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const handleParishClick = useCallback((parishId: string) => {
    navigate(`/parish/${parishId}`);
  }, [navigate]);

  const getErrorMessage = (error: GeolocationPositionError | string) => {
    if (typeof error === 'string') {
      return error;
    }
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location services.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'Error accessing location.';
    }
  };

  useEffect(() => {
    const loadParishes = async () => {
      setLoading(true);
      try {
        const fetchedParishes = await fetchAllParishes();
        setParishes(fetchedParishes);
      } catch (error) {
        console.error('Error fetching parishes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParishes();
  }, []);

  if (loading || geoLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (geoError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">
            {getErrorMessage(geoError)}
          </p>
          <button 
            onClick={refreshLocation}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : MAPS_CONFIG.DEFAULT_LOCATION;

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <GoogleMap
          center={center}
          onLoad={handleMapLoad}
        >
          {location && (
            <LocationMarker
              position={{ lat: location.latitude, lng: location.longitude }}
              title="Your Location"
              isUserLocation
            />
          )}
          {parishes.map((parish) => (
            <LocationMarker
              key={parish.id}
              position={{ lat: parish.latitude, lng: parish.longitude }}
              title={parish.name}
              onClick={() => handleParishClick(parish.id)}
              isParish
            />
          ))}
        </GoogleMap>
        <div className="absolute bottom-4 left-4">
          <TopParishes />
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="bg-white rounded-lg shadow-md p-2 space-y-2">
            <button className="p-2 hover:bg-gray-100 rounded" onClick={() => mapInstance?.setZoom((mapInstance.getZoom() || 0) + 1)}>+</button>
            <button className="p-2 hover:bg-gray-100 rounded" onClick={() => mapInstance?.setZoom((mapInstance.getZoom() || 0) - 1)}>−</button>
            <button className="p-2 hover:bg-gray-100 rounded" onClick={refreshLocation}>📍</button>
          </div>
        </div>
      </div>
    </div>
  );
}