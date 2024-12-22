export interface Parish {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  latitude: number;
  longitude: number;
  leaderName: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  photos: string[];
  openingHours: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  importSource?: 'google_places' | 'google_my_maps' | 'manual' | 'import';
  sourceId?: string;
  distance?: number; // Optional distance property for nearby searches
  featured?: boolean;
  featuredAt?: string;
  featuredBy?: string;
}
  
// New interface for Google Maps place data
export interface GoogleMapsPlace {
  placeId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  lastSynced?: string;
}

// New interface for parish import data
export interface ParishImportData {
  sourceId: string;
  importSource: 'google_my_maps';
  name: string;
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  latitude: number;
  longitude: number;
  lastSynced: string;
}

export interface ParishWithDistance extends Parish {
  distance: number;
}