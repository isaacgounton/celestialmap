export interface Parish {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  leaderName: string;
  phone: string;
  website?: string;
  openingHours: {
    [key: string]: string;
  };
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}