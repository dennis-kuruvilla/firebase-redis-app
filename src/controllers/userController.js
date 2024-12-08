const responseHandler = require('../utils/responseHandler');
const userService = require('../services/userService');

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

exports.getRecentlyViewedProducts = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.uid !== userId) {
            return responseHandler.error(res, 403, 'Forbidden: Access is denied');
        }

        const recentlyViewed = await userService.getRecentlyViewed(userId);

        responseHandler.success(res, 200, 'Recently viewed products retrieved successfully', recentlyViewed);
    } catch (error) {
        console.error('Error fetching recently viewed products:', error);
        responseHandler.error(res, 500, 'Internal Server Error');
    }
};
