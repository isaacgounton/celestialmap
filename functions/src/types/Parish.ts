// functions/types/Parish.ts
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
}
