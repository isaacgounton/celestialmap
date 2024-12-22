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
  openingHours: {
    [key: string]: string;
  };
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
  // Add new sync-related fields
  importSource?: 'google_my_maps' | 'manual' | 'import';
  sourceId?: string;
  lastSynced?: string;
  distance?: number; // Distance in kilometers from search location
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