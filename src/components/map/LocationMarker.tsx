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
          // Pulsing location dot with ring
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#3B82F6",
          fillOpacity: 0.6,
          strokeColor: "#2563EB",
          strokeWeight: 2,
          strokeOpacity: 0.9
        },
        // Add a second marker for the outer ring effect
        label: {
          text: "•",
          color: "#2563EB",
          fontSize: "40px",
          className: "animate-ping"
        },
        zIndex: 2
      };
    }
    if (isParish) {
      return {
        icon: {
          // Custom church icon with cross
          path: `M -2,-8 L 2,-8 L 2,-5 L 4,-5 L 4,-2 L 2,-2 L 2,8 L -2,8 L -2,-2 L -4,-2 L -4,-5 L -2,-5 Z 
                 M -8,8 L 8,8 L 8,10 L -8,10 Z`,
          fillColor: "#8B5CF6",
          fillOpacity: 0.9,
          strokeColor: "#6D28D9",
          strokeWeight: 2,
          strokeOpacity: 0.8,
          scale: 1.5,
          anchor: new google.maps.Point(0, 10),
        },
        // Add label for better visibility
        label: title ? {
          text: title,
          color: "#4C1D95",
          fontSize: "14px",
          fontWeight: "bold",
          className: "marker-label"
        } : undefined,
        animation: google.maps.Animation.DROP,
        zIndex: 1
      };
    }
    return {};
  }, [isUserLocation, isParish, title]);

  return (
    <Marker
      position={position}
      title={title}
      onClick={onClick}
      options={options}
    />
  );
}