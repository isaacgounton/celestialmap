import { useState, useCallback } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import { MapControls } from './MapControls';
import { LocationMarker } from './LocationMarker';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Parish } from '../../types/Parish';

interface MapComponentProps {
  parishes?: Parish[];
  onParishClick?: (parish: Parish) => void;
}

// Update coordinates to Porto-Novo, Benin
const defaultCenter = { lat: 6.4960307, lng: 2.5443571 }; // Porto-Novo, Benin

export function MapComponent({ parishes = [], onParishClick }: MapComponentProps) {
  const { location, loading: geoLoading } = useGeolocation();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const handleLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // If we have user's location, center the map there
    if (location) {
      map.setCenter({ lat: location.latitude, lng: location.longitude });
      map.setZoom(13);
    }
  }, [location]);

  const handleZoomIn = () => {
    if (map) map.setZoom((map.getZoom() || 10) + 1);
  };

  const handleZoomOut = () => {
    if (map) map.setZoom((map.getZoom() || 10) - 1);
  };

  const handleRefresh = () => {
    if (map && location) {
      map.setCenter({ lat: location.latitude, lng: location.longitude });
      map.setZoom(13);
    }
  };

  return (
    <div className="relative w-full h-full">
      <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={location ? { lat: location.latitude, lng: location.longitude } : defaultCenter}
          zoom={13}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
          }}
          onLoad={handleLoad}
        >
          {/* User Location Marker */}
          {location && (
            <LocationMarker
              position={{ lat: location.latitude, lng: location.longitude }}
              isUserLocation
              title="Your Location"
            />
          )}

          {/* Parish Markers */}
          {parishes.map((parish) => (
            <LocationMarker
              key={parish.id}
              position={{ lat: parish.latitude, lng: parish.longitude }}
              title={parish.name}
              isParish
              onClick={() => onParishClick?.(parish)}
            />
          ))}
        </GoogleMap>
      </LoadScriptNext>

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRefresh={handleRefresh}
        onSearch={() => {}}
        loading={geoLoading}
      />
    </div>
  );
}
