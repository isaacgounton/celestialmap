import React, { useRef, useEffect } from 'react';
import { GoogleMap as GoogleMapComponent, useLoadScript } from '@react-google-maps/api';
import { MAPS_CONFIG } from '../../config/constants';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  children?: React.ReactNode;
  onLoad?: (map: google.maps.Map) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export function GoogleMap({ center, zoom = MAPS_CONFIG.DEFAULT_ZOOM, children, onLoad }: GoogleMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAPS_CONFIG.GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (onLoad) {
      onLoad(map);
    }
  };

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading maps...</p>
      </div>
    );
  }

  return (
    <GoogleMapComponent
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={handleLoad}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      {children}
    </GoogleMapComponent>
  );
}