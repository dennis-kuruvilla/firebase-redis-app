const { db, admin } = require('../config/firebaseConfig');

exports.getUserById = async (userId) => {
  try {
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    return userDoc.exists ? userDoc.data() : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw new Error('Failed to fetch user');
  }
};

exports.updateRecentlyViewedProduct = async (userId, productId) => {
  const recentlyViewedRef = db.collection('users').doc(userId).collection('recentlyViewed').doc(productId);

  try {
    const recentlyViewedDoc = await recentlyViewedRef.get();

    if (recentlyViewedDoc.exists) {
      await recentlyViewedRef.update({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await recentlyViewedRef.set({
        productId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      const recentlyViewedQuery = await db.collection('users')
        .doc(userId)
        .collection('recentlyViewed')
        .orderBy('timestamp', 'desc')
        .get();

      if (recentlyViewedQuery.size > 10) {
        const docsToDelete = recentlyViewedQuery.docs.slice(10);
        for (const doc of docsToDelete) {
          await doc.ref.delete();
        }
      }
    }
  } catch (error) {
    console.error('Error updating recently viewed products:', error.message);
    throw new Error('Failed to update recently viewed products');
  }
};

exports.getRecentlyViewed = async (userId) => {
  try {
    const collectionRef = db.collection(`users/${userId}/recentlyViewed`);
    const snapshot = await collectionRef.orderBy('timestamp', 'desc').limit(10).get();

    if (snapshot.empty) {
      return [];
    }

    const recentlyViewed = [];
    snapshot.forEach((doc) => {
      recentlyViewed.push({
        productId: doc.id,
        ...doc.data(),
      });
    });

    return recentlyViewed;
  } catch (error) {
    console.error('Error fetching recently viewed products:', error.message);
    throw new Error('Failed to fetch recently viewed products');
  }
};