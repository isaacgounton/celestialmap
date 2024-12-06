import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { GoogleMap } from '../components/map/GoogleMap';
import { LocationMarker } from '../components/map/LocationMarker';
import { TopParishes } from '../components/parishes/TopParishes';
import { MAPS_CONFIG } from '../config/constants';
import { getNearbyParishes } from '../services/parishService';
import { Parish } from '../types/Parish';

export function Home() {
  const navigate = useNavigate();
  const { location, loading, error, refreshLocation } = useGeolocation();
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const handleParishClick = useCallback((parishId: string) => {
    navigate(`/parish/${parishId}`);
  }, [navigate]);

  // ...existing useCallback and useEffect code...

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