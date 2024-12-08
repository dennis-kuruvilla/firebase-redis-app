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

exports.addRecentlyViewedProduct = async (userId, productId) => {
  const recentlyViewedRef = db.collection('users').doc(userId).collection('recentlyViewed');

  try {
    await recentlyViewedRef.add({
      productId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding recently viewed product:', error.message);
    throw new Error('Failed to add recently viewed product');
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