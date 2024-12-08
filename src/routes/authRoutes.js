/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

 const express = require('express');
 const router = express.Router();
 const authController = require('../controllers/authController');
 const authMiddleware = require('../middlewares/authMiddleware');
 
 /**
  * @swagger
  * /auth/signup:
  *   post:
  *     summary: Sign up a new user
  *     tags: [Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *                 example: user@example.com
  *               password:
  *                 type: string
  *                 example: password123
  *     responses:
  *       201:
  *         description: User created successfully
  *       400:
  *         description: Invalid input
  */
 router.post('/signup', authController.signup);
 
 /**
  * @swagger
  * /auth/login:
  *   post:
  *     summary: Log in a user
  *     tags: [Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *                 example: user@example.com
  *               password:
  *                 type: string
  *                 example: password123
  *     responses:
  *       200:
  *         description: Login successful
  *       401:
  *         description: Unauthorized
  */
 router.post('/login', authController.login);
 
 /**
  * @swagger
  * /auth/logout:
  *   post:
  *     summary: Log out a user
  *     tags: [Auth]
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Logout successful
  *       401:
  *         description: Unauthorized
  */
 router.post('/logout', authMiddleware, authController.logout);
 
 module.exports = router;
 