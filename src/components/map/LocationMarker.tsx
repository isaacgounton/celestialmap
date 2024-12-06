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
  isParish?: boolean;
}

export function LocationMarker({ position, title, onClick, isUserLocation, isParish }: LocationMarkerProps) {
  const options = useMemo(() => {
    if (isUserLocation) {
      return {
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3B82F6",
          fillOpacity: 0.9,
          strokeColor: "#1D4ED8",
          strokeWeight: 3,
          strokeOpacity: 0.8
        },
        zIndex: 2
      };
    }
    if (isParish) {
      return {
        icon: {
          path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
          fillColor: "#8B5CF6",
          fillOpacity: 0.9,
          strokeColor: "#6D28D9",
          strokeWeight: 2,
          strokeOpacity: 0.8,
          scale: 1.5,
          anchor: new google.maps.Point(0, 0),
        },
        zIndex: 1
      };
    }
    return {};
  }, [isUserLocation, isParish]);

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