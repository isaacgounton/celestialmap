import { useMemo } from 'react';
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
          scale: 12,
          fillColor: "#60A5FA", // Blue-400
          fillOpacity: 0.6,
          strokeColor: "#2563EB", // Blue-600
          strokeWeight: 2,
          strokeOpacity: 1,
        },
        // Pulsing animation effect
        animation: google.maps.Animation.BOUNCE,
        zIndex: 2
      };
    }
    if (isParish) {
      return {
        icon: {
          // Custom church cross shape
          path: `M 0,-30 
                 L 0,-20 L 10,-20 L 10,-10 L 0,-10 
                 L 0,0 L -10,0 L -10,10 L 10,10 L 10,0 
                 L 0,0 L 0,-10 L -10,-10 L -10,-20 L 0,-20 Z`,
          fillColor: "#7C3AED", // Violet-600
          fillOpacity: 0.9,
          strokeColor: "#4C1D95", // Violet-900
          strokeWeight: 2,
          strokeOpacity: 1,
          scale: 0.8,
          anchor: new google.maps.Point(0, 0),
        },
        // Smooth drop animation
        animation: google.maps.Animation.DROP,
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
    />
  );
}