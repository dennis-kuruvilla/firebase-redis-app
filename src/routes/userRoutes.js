/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User-related endpoints
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', userController.getMe);

/**
 * @swagger
 * /users/{userId}/recentlyViewed:
 *   get:
 *     summary: Get a user's recently viewed products
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Recently viewed products retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:userId/recentlyViewed', userController.getRecentlyViewed);

module.exports = router;
