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
  description?: string;  // Add this line to include optional description
  openingHours: {
    [key: string]: string;
  };
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}