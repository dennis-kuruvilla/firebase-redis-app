/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

 const express = require('express');
 const productController = require('../controllers/productController');
 const router = express.Router();
 
 /**
  * @swagger
  * /products:
  *   post:
  *     summary: Create a new product
  *     tags: [Products]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               name:
  *                 type: string
  *                 example: Product Name
  *               description:
  *                 type: string
  *                 example: Product description
  *               price:
  *                 type: number
  *                 example: 99.99
  *     responses:
  *       201:
  *         description: Product created successfully
  *       400:
  *         description: Invalid input
  */
 router.post('/', productController.createProduct);
 
 /**
  * @swagger
  * /products:
  *   get:
  *     summary: Get all products
  *     tags: [Products]
  *     responses:
  *       200:
  *         description: A list of products
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 type: object
  */
 router.get('/', productController.getAllProducts);
 
 /**
  * @swagger
  * /products/{productId}:
  *   get:
  *     summary: Get a product by ID
  *     tags: [Products]
  *     parameters:
  *       - in: path
  *         name: productId
  *         schema:
  *           type: string
  *         required: true
  *         description: The product ID
  *     responses:
  *       200:
  *         description: Product details
  *       404:
  *         description: Product not found
  */
 router.get('/:productId', productController.getProduct);
 
 /**
  * @swagger
  * /products/{productId}:
  *   put:
  *     summary: Update a product
  *     tags: [Products]
  *     parameters:
  *       - in: path
  *         name: productId
  *         schema:
  *           type: string
  *         required: true
  *         description: The product ID
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               name:
  *                 type: string
  *                 example: Updated Product Name
  *               description:
  *                 type: string
  *                 example: Product description
  *               price:
  *                 type: number
  *                 example: 149.99
  *     responses:
  *       200:
  *         description: Product updated successfully
  *       404:
  *         description: Product not found
  */
 router.put('/:productId', productController.updateProduct);
 
 /**
  * @swagger
  * /products/{productId}:
  *   delete:
  *     summary: Delete a product
  *     tags: [Products]
  *     parameters:
  *       - in: path
  *         name: productId
  *         schema:
  *           type: string
  *         required: true
  *         description: The product ID
  *     responses:
  *       200:
  *         description: Product deleted successfully
  *       404:
  *         description: Product not found
  */
 router.delete('/:productId', productController.deleteProduct);
 
 module.exports = router;
 