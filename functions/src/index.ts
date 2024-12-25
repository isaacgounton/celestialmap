import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { verifyAdmin } from './utils/adminUtils';
import { fetchMapFeatures, convertToParish } from './syncGoogleMaps';
import { importPlacesFromGoogle } from './importPlaces';
import { importFromSpreadsheet } from './importSpreadsheet';

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export functions with explicit error handling
export * from './admin/adminFunctions';
export * from './parishes/parishFunctions';
export * from './sync/syncFunctions';

// Add region configuration
const regionalFunctions = functions.region('us-central1');

export const importExistingPlaces = regionalFunctions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  await verifyAdmin(context.auth.uid);

  try {
    console.log('Starting MyMaps import...');
    const features = await fetchMapFeatures();
    const parishesRef = admin.database().ref('parishes');
    let importCount = 0;

    for (const feature of features) {
      const parish = convertToParish(feature);
      if (parish.sourceId) {
        await parishesRef.child(parish.sourceId).set(parish);
        importCount++;
      }
    }

    return { count: importCount, message: `Successfully imported ${importCount} parishes` };
  } catch (error) {
    console.error('MyMaps import failed:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Import failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

interface ImportPlacesData {
  countryCode?: string;
}

export const importFromGooglePlaces = regionalFunctions.https.onCall(async (data: ImportPlacesData = {}, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const adminRef = admin.database().ref(`admins/${context.auth.uid}`);
  const isAdmin = (await adminRef.get()).val() === true;

  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'User must be an admin');
  }

  try {
    console.log('Starting import with data:', data);
    console.log('Using Google Maps API key:', process.env.GOOGLE_MAPS_API_KEY ? 'Set' : 'Not set');
    
    const result = await importPlacesFromGoogle(data.countryCode || 'NG');
    console.log('Import completed successfully:', result);
    return result;
  } catch (error: unknown) {
    console.error('Import failed:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    throw new functions.https.HttpsError('internal', `Import failed: ${errorMessage}`);
  }
});

export const importFromSpreadsheetFn = regionalFunctions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const adminRef = admin.database().ref(`admins/${context.auth.uid}`);
  const isAdmin = (await adminRef.get()).val() === true;

  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
  }

  try {
    const { url } = data;
    if (!url) {
      throw new functions.https.HttpsError('invalid-argument', 'Spreadsheet URL is required');
    }

    const result = await importFromSpreadsheet(url);
    return result;
  } catch (error) {
    console.error('Spreadsheet import failed:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Import failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});
