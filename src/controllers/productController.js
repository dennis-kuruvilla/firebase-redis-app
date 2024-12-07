const productService = require('../services/productService');

async function createProduct(req, res) {
  try {
    const product = req.body;
    const newProduct = await productService.createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProduct(req, res) {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { productId } = req.params;
    const updatedData = req.body;
    const updatedProduct = await productService.updateProduct(productId, updatedData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;
    const response = await productService.deleteProduct(productId);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
