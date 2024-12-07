const { db } = require('../config/firebaseConfig');
const responseHandler = require('../utils/responseHandler');

exports.getMe = async (req, res) => {
    try {
        const userId = req.user.uid;
        const userDocRef = db.collection('users').doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return responseHandler.error(res, 404, 'User not found');
        }

        responseHandler.success(res, 200, 'Welcome, authenticated user!', { userId: req.user.uid, userData: userDoc.data() });
    } catch (error) {
        console.error('Error:', error);
        responseHandler.error(res, 500, 'Internal Server Error');
    }
};
