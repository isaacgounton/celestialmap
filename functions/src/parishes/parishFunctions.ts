import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const addPersonalPlace = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 300,
    memory: '256MB'
  })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be authenticated'
      );
    }

    const { place } = data;
    if (!place || !place.name || !place.address) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Place must include name and address'
      );
    }

    try {
      const personalPlacesRef = admin.database()
        .ref(`users/${context.auth.uid}/places`);
      
      const newPlaceRef = personalPlacesRef.push();
      await newPlaceRef.set({
        ...place,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        createdBy: context.auth.uid,
        status: 'pending'
      });

      return { 
        success: true, 
        id: newPlaceRef.key,
        message: 'Place added successfully'
      };
    } catch (error) {
      console.error('Error adding personal place:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to add place',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  });

export const onParishUpdate = functions.region('us-central1')
  .database.ref('/parishes/{parishId}')
  .onWrite(async (change, context) => {
    const parish = change.after.val();
    const parishId = context.params.parishId;

    if (!parish) return null;

    // Update search index
    const searchRef = admin.database().ref('search/parishes');
    await searchRef.child(parishId).set({
      name: parish.name?.toLowerCase(),
      address: parish.address?.toLowerCase(),
      city: parish.city?.toLowerCase(),
      country: parish.country?.toLowerCase(),
      parishId
    });

    return null;
  });
