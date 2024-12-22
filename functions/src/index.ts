import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { importPlacesFromGoogle } from './importPlaces';

admin.initializeApp();

// Add region configuration
const regionalFunctions = functions.region('us-central1');

export {
  syncGoogleMyMaps,
  triggerSync,
  onParishUpdate,
  addPersonalPlace,
  importExistingPlaces
} from './syncGoogleMaps';

export {
  setAdminClaim,
  checkAdminStatus
} from './auth';

export const setAdmin = regionalFunctions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  // Only super admins can create other admins
  const adminRef = admin.database().ref(`admins/${context.auth.uid}`);
  const adminSnapshot = await adminRef.once('value');
  
  if (!adminSnapshot.val()) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create other admins');
  }

  const { uid, isAdmin } = data;
  await admin.database().ref(`admins/${uid}`).set(isAdmin);
  
  return { success: true };
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
