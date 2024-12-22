import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Client, PlaceType1 } from '@googlemaps/google-maps-services-js';
import { Parish } from './types/Parish';

const client = new Client({});

export const importPlacesFromGoogle = async (countryCode: string = 'NG') => {
  const config = functions.config();
  const apiKey = config.google?.maps_key;
  
  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  const searchQuery = 'Celestial Church of Christ';
  const places = await client.textSearch({
    params: {
      query: searchQuery,
      key: apiKey,
      type: PlaceType1.church,
      region: countryCode
    }
  });

  const validPlaces = places.data.results.filter(
    place => place.name?.toLowerCase().includes('celestial church')
  );

  const parishesRef = admin.database().ref('parishes');
  let importCount = 0;

  for (const place of validPlaces) {
    if (!place.place_id || !place.name || !place.formatted_address || !place.geometry?.location) {
      console.log('Skipping invalid place:', place);
      continue;
    }

    const details = await client.placeDetails({
      params: {
        place_id: place.place_id,
        key: apiKey,
        fields: ['formatted_phone_number', 'website', 'opening_hours']
      }
    });

    const addressParts = place.formatted_address.split(',').map(part => part.trim());
    const parish: Omit<Parish, 'id'> = {
      name: place.name,
      address: {
        street: addressParts[0] || '',
        city: addressParts[1] || '',
        province: addressParts[2] || '',
        country: countryCode,
        postalCode: ''
      },
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      phone: details.data.result.formatted_phone_number || '',
      email: '',
      website: details.data.result.website || '',
      leaderName: '',
      description: place.formatted_address,
      photos: place.photos?.map(p => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${apiKey}`
      ) || [],
      openingHours: details.data.result.opening_hours?.weekday_text?.reduce((acc, curr) => {
        const [day, hours] = curr.split(': ');
        return { ...acc, [day.toLowerCase()]: hours };
      }, {} as Record<string, string>) || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      importSource: 'google_places' as const,
      sourceId: place.place_id
    };

    // Check if parish already exists by sourceId
    const existingParish = (await parishesRef
      .orderByChild('sourceId')
      .equalTo(place.place_id)
      .once('value')).val();

    if (!existingParish) {
      await parishesRef.push(parish);
      importCount++;
    }
  }

  return { count: importCount, message: `Imported ${importCount} new parishes` };
};
