import React, { useMemo } from 'react';
import { Marker } from '@react-google-maps/api';

interface LocationMarkerProps {
  position: {
    lat: number;
    lng: number;
  };
  title?: string;
  onClick?: () => void;
  isUserLocation?: boolean;
}

export function LocationMarker({ position, title, onClick, isUserLocation }: LocationMarkerProps) {
  const options = useMemo(() => ({
    icon: isUserLocation ? {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#4A90E2",
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 2,
    } : undefined
  }), [isUserLocation]);

  return (
    <Marker
      position={position}
      title={title}
      onClick={onClick}
      options={options}
      animation={google.maps.Animation.DROP}
    />
  );
}