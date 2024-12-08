const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/me', userController.getMe);
router.get('/:userId/recentlyViewed', userController.getRecentlyViewedProducts);

module.exports = router;
