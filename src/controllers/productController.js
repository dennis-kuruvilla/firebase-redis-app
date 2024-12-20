const productService = require('../services/productService');
const userService = require('../services/userService');
const cacheService = require('../services/cacheService');

exports.createProduct = async (req, res) => {
  try {
    const product = req.body;
    const userId = req.user.uid;
    const newProduct = await productService.createProduct({ ...product, createdBy: userId });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.uid;

    const product = await productService.getProductById(productId);

    await userService.addRecentlyViewedProduct(userId, productId);

    const cacheKey = `recentlyViewed:${userId}`;
    await cacheService.deleteFromCache(cacheKey);

    console.log(`User ${userId} viewed the product ${productId}`)

    res.status(200).json(product);
  } catch (error) {
    console.error('Error in getProduct:', error.message);
    res.status(404).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedData = req.body;
    const updatedProduct = await productService.updateProduct(productId, updatedData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const response = await productService.deleteProduct(productId);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
