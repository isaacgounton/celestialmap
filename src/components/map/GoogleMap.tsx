import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap as GoogleMapComponent, useLoadScript, Libraries } from '@react-google-maps/api';
import { MAPS_CONFIG } from '../../config/constants';
import { MapIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

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

const libraries: Libraries = ['places', 'geometry', 'drawing'];

export function GoogleMap({ center, zoom = MAPS_CONFIG.DEFAULT_ZOOM, children, onLoad }: GoogleMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAPS_CONFIG.GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [mapType, setMapType] = useState<google.maps.MapTypeId>(google.maps.MapTypeId.ROADMAP);

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

  const MapTypeControl = () => (
    <div className="absolute left-4 top-4 bg-white rounded-lg shadow-md p-1 z-10">
      <div className="flex flex-col gap-2">
        <button
          className={`p-2 rounded-md transition-colors ${
            mapType === google.maps.MapTypeId.ROADMAP
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => {
            setMapType(google.maps.MapTypeId.ROADMAP);
            if (mapRef.current) {
              mapRef.current.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            }
          }}
          title="Map View"
        >
          <MapIcon className="w-6 h-6" />
        </button>
        <button
          className={`p-2 rounded-md transition-colors ${
            mapType === google.maps.MapTypeId.SATELLITE
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => {
            setMapType(google.maps.MapTypeId.SATELLITE);
            if (mapRef.current) {
              mapRef.current.setMapTypeId(google.maps.MapTypeId.SATELLITE);
            }
          }}
          title="Satellite View"
        >
          <GlobeAltIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

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
    <div className="relative h-full">
      <MapTypeControl />
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
          mapTypeId: mapType,
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
    </div>
  );
}