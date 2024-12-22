import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../../hooks/useGeolocation';
import { GoogleMap } from '../map/GoogleMap';
import { LocationMarker } from '../map/LocationMarker';
import { MapControls } from '../map/MapControls';
import { MAPS_CONFIG } from '../../config/constants';
import { getNearbyParishes } from '../../services/parishService';
import { Parish } from '../../types/Parish';

export function ParishMap() {
  const navigate = useNavigate();
  const { location, loading, error, refreshLocation } = useGeolocation();
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const handleSearch = useCallback(async () => {
    if (location) {
      try {
        const nearbyParishes = await getNearbyParishes(location.latitude, location.longitude);
        setParishes(nearbyParishes);
      } catch (error) {
        console.error('Error fetching parishes:', error);
      }
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      handleSearch();
    }
  }, [location, handleSearch]);

  const handleParishClick = useCallback((parishId: string) => {
    navigate(`/parish/${parishId}`);
  }, [navigate]);

  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      mapInstance.setZoom((mapInstance.getZoom() || 14) + 1);
    }
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      mapInstance.setZoom((mapInstance.getZoom() || 14) - 1);
    }
  }, [mapInstance]);

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : MAPS_CONFIG.DEFAULT_LOCATION;

  return (
    <div className="relative h-full">
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
          />
        ))}
      </GoogleMap>
      <MapControls
        onRefresh={refreshLocation}
        onSearch={handleSearch}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        loading={loading}
      />
    </div>
  );
}