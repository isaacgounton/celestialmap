import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

const main = async () => {
  try {
    // Read service account file
    const serviceAccount = JSON.parse(
      await readFile(join(__dirname, '../service-account.json'), 'utf8')
    );

    // Initialize Firebase Admin SDK
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: "https://ccclocator-default-rtdb.firebaseio.com"
    });

    // Get UID from command line args
    const uid = process.argv[2];
    if (!uid) {
      console.error('Please provide a user ID');
      process.exit(1);
    }

    // Set admin status
    const db = getDatabase();
    await db.ref(`admins/${uid}`).set(true);
    console.log(`Successfully set ${uid} as admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

main();
