import * as functions from 'firebase-functions';
import { GoogleAuth } from 'google-auth-library';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Define Parish type locally since we can't access the root src
interface Parish {
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
  description?: string;
  openingHours: { [key: string]: string };
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
  importSource?: 'google_my_maps' | 'manual' | 'import';
  sourceId?: string;
  lastSynced?: string;
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const config = functions.config().google || {};
const db = admin.database();

const auth = new GoogleAuth({
  credentials: {
    client_email: config.client_email,
    private_key: config.private_key?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/mapsengine']
});

const fetchMapFeatures = async () => {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  
  const response = await axios.get(
    `https://www.googleapis.com/mapsengine/v1/tables/${config.my_maps_id}/features`,
    {
      headers: {
        Authorization: `Bearer ${token.token}`,
        'X-Goog-Maps-API-Key': config.maps_api_key
      }
    }
  );
  
  return response.data.features || [];
};

const parseAddress = (fullAddress: string) => {
  const parts = fullAddress.split(',').map(part => part.trim());
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    province: parts[2] || '',
    country: parts[parts.length - 1] || '',
    postalCode: '',
  };
};

const convertToParish = (feature: any): Partial<Parish> => {
  const now = new Date();
  const address = parseAddress(feature.properties.address || '');
  
  return {
    id: `gmap_${feature.properties.id}`,
    name: feature.properties.name,
    address,
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
    leaderName: '',
    phone: '',
    email: '',
    description: feature.properties.description || '',
    openingHours: {},
    photos: [],
    createdAt: now,
    updatedAt: now,
    importSource: 'google_my_maps',
    sourceId: feature.properties.id,
    lastSynced: now.toISOString()
  };
};

// Scheduled sync function that runs every 12 hours
export const syncGoogleMyMaps = functions.pubsub
  .schedule('every 12 hours')
  .onRun(async (context) => {
    if (!config.maps_api_key || !config.my_maps_id) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Missing required Google Maps configuration'
      );
    }

    try {
      const features = await fetchMapFeatures();
      const parishesRef = db.ref('parishes');

      // Process in batches of 50
      const batchSize = 50;
      for (let i = 0; i < features.length; i += batchSize) {
        const batch = features.slice(i, i + batchSize);
        const updates: { [key: string]: any } = {};

        for (const feature of batch) {
          const parish = convertToParish(feature);
          if (parish.sourceId) {
            updates[`/${parish.sourceId}`] = parish;
          }
        }

        // Perform batch update
        if (Object.keys(updates).length > 0) {
          await parishesRef.update(updates);
        }
      }

      functions.logger.info(`Synced ${features.length} parishes from Google My Maps`);
      return null;
    } catch (error) {
      functions.logger.error('Sync failed:', error);
      throw new functions.https.HttpsError('internal', 'Sync failed', error);
    }
  });

// Manual trigger endpoint for testing
export const triggerSync = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    await syncGoogleMyMaps({} as functions.EventContext);
    res.status(200).json({
      success: true,
      message: 'Sync completed successfully'
    });
  } catch (error) {
    functions.logger.error('Manual sync failed:', error);
    res.status(500).json({
      success: false,
      message: 'Sync failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Listen for manual parish updates
export const onParishUpdate = functions.database
  .ref('/parishes/{parishId}')
  .onWrite(async (change, context) => {
    const parish = change.after.val() as Parish;
    
    // Only process Google My Maps imported parishes
    if (!parish || parish.importSource !== 'google_my_maps') {
      return null;
    }

    try {
      // Update timestamp
      parish.updatedAt = new Date();
      parish.lastSynced = new Date().toISOString();
      
      await change.after.ref.update(parish);
      functions.logger.info(`Updated parish: ${parish.name}`);
      return null;
    } catch (error) {
      functions.logger.error('Parish update failed:', error);
      throw new functions.https.HttpsError('internal', 'Update failed', error);
    }
  });

// Add personal map place endpoint
export const addPersonalPlace = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to add places'
    );
  }

  try {
    const { name, address, location, placeId } = data;
    const now = new Date();
    
    const parish: Partial<Parish> = {
      id: `personal_${placeId}`,
      name,
      address: parseAddress(address),
      latitude: location.lat,
      longitude: location.lng,
      createdAt: now,
      updatedAt: now,
      importSource: 'manual',
      sourceId: placeId,
      lastSynced: now.toISOString(),
      leaderName: '',
      phone: '',
      email: '',
      openingHours: {},
      photos: []
    };

    const parishRef = db.ref(`parishes/${parish.id}`);
    await parishRef.set(parish);
    
    functions.logger.info(`Added personal place: ${name}`);
    return { success: true, parish };
  } catch (error) {
    functions.logger.error('Failed to add personal place:', error);
    throw new functions.https.HttpsError('internal', 'Failed to add place', error);
  }
});

// Initial import of existing places
export const importExistingPlaces = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    if (!config.maps_api_key || !config.my_maps_id) {
      throw new Error('Missing required Google Maps configuration');
    }

    // Fetch existing parishes to check for duplicates
    const existingParishes = await db.ref('parishes').once('value');
    const existingIds = new Set(
      Object.values(existingParishes.val() || {})
        .map((parish: any) => parish.sourceId)
    );

    // Fetch all places from Google My Maps
    const features = await fetchMapFeatures();
    const parishesRef = db.ref('parishes');
    let importedCount = 0;

    // Process in batches
    const batchSize = 50;
    for (let i = 0; i < features.length; i += batchSize) {
      const batch = features.slice(i, i + batchSize);
      const updates: { [key: string]: any } = {};

      for (const feature of batch) {
        // Skip if already imported
        if (existingIds.has(feature.properties.id)) {
          continue;
        }

        const parish = convertToParish(feature);
        if (parish.sourceId) {
          updates[`/${parish.sourceId}`] = parish;
          importedCount++;
        }
      }

      // Perform batch update if there are new places
      if (Object.keys(updates).length > 0) {
        await parishesRef.update(updates);
      }
    }

    functions.logger.info(`Imported ${importedCount} existing places from Google My Maps`);
    res.status(200).json({
      success: true,
      message: `Successfully imported ${importedCount} places`,
      imported: importedCount
    });
  } catch (error) {
    functions.logger.error('Import failed:', error);
    res.status(500).json({
      success: false,
      message: 'Import failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
