import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { importPlacesFromGoogle } from './importPlaces';
import { importFromSpreadsheet } from './importSpreadsheet';
import { 
  fetchMapFeatures,
  convertToParish
} from './syncGoogleMaps';

admin.initializeApp();

// Add region configuration
const regionalFunctions = functions.region('us-central1');

// Convert importExistingPlaces to a regional function
export const importExistingPlaces = regionalFunctions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const adminRef = admin.database().ref(`admins/${context.auth.uid}`);
  const isAdmin = (await adminRef.get()).val() === true;

  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
  }

  const config = functions.config().google || {};
  if (!config.maps_api_key || !config.my_maps_id) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Missing Google Maps configuration'
    );
  }

  try {
    console.log('Starting MyMaps import...');
    const features = await fetchMapFeatures();  // Now using directly imported function
    const parishesRef = admin.database().ref('parishes');
    let importCount = 0;

    for (const feature of features) {
      const parish = convertToParish(feature);  // Now using directly imported function
      if (parish.sourceId) {
        await parishesRef.child(parish.sourceId).set(parish);
        importCount++;
      }
    }

    return {
      count: importCount,
      message: `Successfully imported ${importCount} parishes`
    };
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
