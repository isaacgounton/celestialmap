import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { verifyAdmin } from '../utils/adminUtils';

export const checkAdminStatus = functions.region('us-central1').https.onCall(async (data, context) => {
  if (!context.auth) {
    return { isAdmin: false };
  }
  
  try {
    await verifyAdmin(context.auth.uid);
    return { isAdmin: true };
  } catch (error) {
    return { isAdmin: false };
  }
});

export const setAdmin = functions.region('us-central1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  await verifyAdmin(context.auth.uid);
  
  const { userId, isAdmin } = data;
  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
  }

  const adminRef = admin.database().ref(`admins/${userId}`);
  await adminRef.set(isAdmin);
  
  return { success: true };
});

export const setAdminClaim = functions.region('us-central1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  await verifyAdmin(context.auth.uid);
  
  const { userId, isAdmin } = data;
  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
  }

  await admin.auth().setCustomUserClaims(userId, { admin: isAdmin });
  return { success: true };
});
