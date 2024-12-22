import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { verifyAdmin } from '../utils/adminUtils';
import { fetchMapFeatures, convertToParish } from '../syncGoogleMaps';

export const syncGoogleMyMaps = functions.region('us-central1')
  .pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
    try {
      const features = await fetchMapFeatures();
      const updates: Record<string, any> = {};

      for (const feature of features) {
        const parish = convertToParish(feature);
        if (parish.sourceId) {
          updates[`parishes/${parish.sourceId}`] = parish;
        }
      }

      if (Object.keys(updates).length > 0) {
        await admin.database().ref().update(updates);
      }

      return null;
    } catch (error) {
      console.error('Sync failed:', error);
      return null;
    }
  });

export const triggerSync = functions.region('us-central1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  await verifyAdmin(context.auth.uid);

  try {
    const features = await fetchMapFeatures();
    const updates: Record<string, any> = {};

    for (const feature of features) {
      const parish = convertToParish(feature);
      if (parish.sourceId) {
        updates[`parishes/${parish.sourceId}`] = parish;
      }
    }

    if (Object.keys(updates).length > 0) {
      await admin.database().ref().update(updates);
    }

    return { success: true, count: Object.keys(updates).length };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Sync failed', 
      error instanceof Error ? error.message : 'Unknown error');
  }
});
