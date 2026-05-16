// Firebase Configuration
// This file sets up Firebase for cloud database storage
// We'll use Firebase to store transaction data as backup

const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase Admin (for backend operations)
// We need a service account key file for this
try {
  // Check if we have Firebase config in environment
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log("✅ Firebase Admin initialized successfully");
  } else {
    console.log(
      "⚠️ Firebase credentials not found in .env - Firebase features will be disabled",
    );
  }
} catch (error) {
  console.log("⚠️ Firebase initialization skipped:", error.message);
}

// Get Firestore database instance (only if Firebase was initialized)
// Firestore is Firebase's cloud database - like a big JSON storage
let db = null;
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    db = admin.firestore();
  }
} catch (error) {
  console.log("⚠️ Firestore not available:", error.message);
  db = null;
}

module.exports = {
  admin,
  db,
  // Helper function to check if Firebase is available
  isFirebaseAvailable: () => db !== null,
};
