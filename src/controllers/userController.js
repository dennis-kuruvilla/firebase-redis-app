const responseHandler = require('../utils/responseHandler');
const userService = require('../services/userService');
const cacheService = require('../services/cacheService');

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.uid;

    const userData = await userService.getUserById(userId);

    if (!userData) {
      return responseHandler.error(res, 404, 'User not found');
    }

    responseHandler.success(res, 200, 'Welcome, authenticated user!', { userId, userData });
  } catch (error) {
    console.error('Error in getMe:', error);
    responseHandler.error(res, 500, 'Internal Server Error');
  }
};

exports.getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cacheKey = `recentlyViewed:${userId}`;

    const cachedData = await cacheService.getFromCache(cacheKey);
    if (cachedData) {
      console.log('Cache hit for recentlyViewed');
      return res.status(200).json(cachedData);
    }

    const recentlyViewed = await userService.getRecentlyViewed(userId);

    await cacheService.saveToCache(cacheKey, recentlyViewed);

    res.status(200).json(recentlyViewed);
  } catch (error) {
    console.error('Error in getRecentlyViewed:', error.message);
    res.status(500).json({ error: 'Failed to fetch recently viewed products' });
  }
};