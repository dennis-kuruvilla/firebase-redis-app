const Product = require('../models/productModel');
const { db } = require('../config/firebaseConfig');

async function createProduct(productData) {
  const newProduct = new Product(
    productData.name,
    productData.description,
    productData.price,
    productData.category,
    productData.createdBy
  );
  const docRef = await db.collection('products').add(newProduct.toFirestoreFormat());
  return { id: docRef.id, ...newProduct };
}

async function getProductById(productId) {
  const docRef = db.collection('products').doc(productId);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Product not found');
  }
  return { id: doc.id, ...doc.data() };
}

async function getAllProducts() {
  const snapshot = await db.collection('products').get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function updateProduct(productId, updatedData) {
  const docRef = db.collection('products').doc(productId);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Product not found');
  }

  await docRef.update({
    ...updatedData,
    updatedAt: new Date(),
  });

  return { id: doc.id, ...doc.data(), ...updatedData };
}

async function deleteProduct(productId) {
  const docRef = db.collection('products').doc(productId);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Product not found');
  }

  await docRef.delete();
  return { message: 'Product deleted successfully' };
}

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
