import * as functions from 'firebase-functions';
    import { getDatabase } from 'firebase-admin/database';

    export async function verifyAdmin(uid: string): Promise<void> {
      if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
      }

      const adminRef = getDatabase().ref(`admins/${uid}`);
      const snapshot = await adminRef.get();
      const isAdmin = snapshot.val() === true;

      functions.logger.info(`User ${uid} admin status: ${isAdmin}`);

      if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
      }
    }
