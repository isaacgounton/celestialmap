import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const addPersonalPlace = functions.region('us-central1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { place } = data;
  if (!place) {
    throw new functions.https.HttpsError('invalid-argument', 'Place data is required');
  }

  const personalPlacesRef = admin.database().ref(`users/${context.auth.uid}/places`);
  const newPlaceRef = personalPlacesRef.push();
  await newPlaceRef.set({
    ...place,
    createdAt: admin.database.ServerValue.TIMESTAMP,
    createdBy: context.auth.uid
  });

  return { id: newPlaceRef.key };
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
