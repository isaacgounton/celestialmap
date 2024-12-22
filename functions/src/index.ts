import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

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

export const setAdmin = functions.https.onCall(async (data, context) => {
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
