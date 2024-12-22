import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const setAdminClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to manage admins'
    );
  }

  // Check if requester is admin
  const requesterSnapshot = await admin.database()
    .ref(`admins/${context.auth.uid}`)
    .once('value');
  
  if (!requesterSnapshot.val() && !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can manage other admins'
    );
  }

  const { email, isAdmin } = data;

  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: isAdmin });
    
    // Update admins in database
    await admin.database().ref(`admins/${user.uid}`).set(isAdmin);

    return {
      success: true,
      message: `Successfully ${isAdmin ? 'added' : 'removed'} admin rights for ${email}`
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Failed to set admin claim', error);
  }
});

export const checkAdminStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be logged in to check admin status'
    );
  }

  try {
    const adminSnapshot = await admin.database()
      .ref(`admins/${context.auth.uid}`)
      .once('value');
    
    const idTokenResult = await admin.auth()
      .getUser(context.auth.uid)
      .then(user => user.customClaims);

    return {
      isAdmin: adminSnapshot.val() === true || idTokenResult?.admin === true
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Failed to check admin status', error);
  }
});
