const authService = require('../services/authService');
const responseHandler = require('../utils/responseHandler');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return responseHandler.error(res, 422, "Email and password are required");
  }

  try {
    await authService.signup(email, password);
    responseHandler.success(res, 201, "User created successfully! Use log in API to get token");
  } catch (error) {
    responseHandler.error(res, 500, error.message || "An error occurred while registering the user");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return responseHandler.error(res, 422, "Email and password are required");
  }

  try {
    const token = await authService.login(email, password);
    responseHandler.success(res, 200, "Login successful!", { token });
  } catch (error) {
    responseHandler.error(res, 401, "Invalid email or password", error.response?.data || error.message);
  }
};

exports.logout = async (req, res) => {
  const uid = req.user.uid;
  if (!uid) {
    return responseHandler.error(res, 422, "User ID (uid) is required to log out");
  }

  try {
    await authService.logout(uid);
    responseHandler.success(res, 200, "User logged out successfully!");
  } catch (error) {
    responseHandler.error(res, 500, error.message || "An error occurred while logging out");
  }
};
