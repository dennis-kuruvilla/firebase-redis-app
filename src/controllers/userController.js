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
