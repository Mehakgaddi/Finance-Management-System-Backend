// Firebase Service
// This file contains helper functions to save/read data from Firebase
// Simple operations for transactions and backups

const { db, isFirebaseAvailable } = require("../config/firebase");

// SAVE TRANSACTION TO FIREBASE
// When user adds a transaction, we also save it to Firebase as backup
// We align the document ID in Firebase with the transaction ID in MySQL so they can be deleted/updated properly.
const saveTransactionToFirebase = async (userId, transactionId, transactionData) => {
  try {
    if (!isFirebaseAvailable()) {
      console.log("Firebase not available, skipping backup");
      return null;
    }

    // In Firebase, we create a path like: users/{userId}/transactions/{transactionId}
    // This organizes data by user first, then their transactions
    const docId = transactionId ? String(transactionId) : undefined;
    const transactionRef = db
      .collection("users")
      .doc(String(userId))
      .collection("transactions")
      .doc(docId);

    // Save the transaction data
    await transactionRef.set({
      ...transactionData,
      createdAt: new Date(),
    });

    console.log("✅ Transaction backed up to Firebase:", transactionRef.id);
    return transactionRef.id;
  } catch (error) {
    console.log("❌ Firebase backup failed:", error.message);
    // Don't throw error - backup failure shouldn't stop the main operation
    return null;
  }
};

// GET ALL USER TRANSACTIONS FROM FIREBASE
const getUserTransactionsFromFirebase = async (userId) => {
  try {
    if (!isFirebaseAvailable()) {
      console.log("Firebase not available");
      return [];
    }

    // Query all transactions for this user
    const snapshot = await db
      .collection("users")
      .doc(String(userId))
      .collection("transactions")
      .orderBy("createdAt", "desc")
      .get();

    // Convert Firebase data to array
    const transactions = [];
    snapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return transactions;
  } catch (error) {
    console.log("❌ Failed to fetch from Firebase:", error.message);
    return [];
  }
};

// SAVE USER DATA TO FIREBASE
// Store basic user info for reference
const saveUserToFirebase = async (userId, userData) => {
  try {
    if (!isFirebaseAvailable()) {
      return null;
    }

    await db.collection("users").doc(String(userId)).set(
      {
        name: userData.name,
        email: userData.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }, // merge means update existing, don't overwrite
    );

    console.log("✅ User data backed up to Firebase");
    return true;
  } catch (error) {
    console.log("❌ Failed to save user to Firebase:", error.message);
    return null;
  }
};

// GET USER DATA FROM FIREBASE
const getUserFromFirebase = async (userId) => {
  try {
    if (!isFirebaseAvailable()) {
      return null;
    }

    const doc = await db.collection("users").doc(String(userId)).get();

    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }

    return null;
  } catch (error) {
    console.log("❌ Failed to fetch user from Firebase:", error.message);
    return null;
  }
};

// DELETE TRANSACTION FROM FIREBASE
const deleteTransactionFromFirebase = async (userId, transactionId) => {
  try {
    if (!isFirebaseAvailable()) {
      return null;
    }

    await db
      .collection("users")
      .doc(String(userId))
      .collection("transactions")
      .doc(transactionId)
      .delete();

    console.log("✅ Transaction deleted from Firebase");
    return true;
  } catch (error) {
    console.log("❌ Failed to delete from Firebase:", error.message);
    return null;
  }
};

module.exports = {
  saveTransactionToFirebase,
  getUserTransactionsFromFirebase,
  saveUserToFirebase,
  getUserFromFirebase,
  deleteTransactionFromFirebase,
};
