const authController = require('../../src/controllers/authController');
const authService = require('../../src/services/authService');
const responseHandler = require('../../src/utils/responseHandler');

jest.mock('../../src/services/authService');
jest.mock('../../src/utils/responseHandler');


describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Signup', () => {
    it('should return 422 if email or password is missing', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.signup(req, res);

      expect(responseHandler.error).toHaveBeenCalledWith(
        res,
        422,
        "Email and password are required"
      );
    });

    it('should call authService.signup and return success message on success', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      authService.signup.mockResolvedValue();

      await authController.signup(req, res);

      expect(authService.signup).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(responseHandler.success).toHaveBeenCalledWith(
        res,
        201,
        "User created successfully! Use log in API to get token"
      );
    });

    it('should handle errors from authService.signup', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const errorMessage = "Database error";

      authService.signup.mockRejectedValue(new Error(errorMessage));

      await authController.signup(req, res);

      expect(responseHandler.error).toHaveBeenCalledWith(
        res,
        500,
        errorMessage
      );
    });
  });

  describe('Login', () => {
    it('should return 422 if email or password is missing', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.login(req, res);

      expect(responseHandler.error).toHaveBeenCalledWith(
        res,
        422,
        "Email and password are required"
      );
    });

    it('should return a token on successful login', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const token = 'mockToken';
      authService.login.mockResolvedValue(token);

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(responseHandler.success).toHaveBeenCalledWith(
        res,
        200,
        "Login successful!",
        { token }
      );
    });

    it('should return 401 on invalid credentials', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      authService.login.mockRejectedValue(new Error("Invalid email or password"));

      await authController.login(req, res);

      expect(responseHandler.error).toHaveBeenCalledWith(
        res,
        401,
        "Invalid email or password",
        expect.any(String)
      );
    });
  });

  describe('Logout', () => {
    it('should return 422 if uid is missing', async () => {
      const req = { user: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.logout(req, res);

      expect(responseHandler.error).toHaveBeenCalledWith(
        res,
        422,
        "User ID (uid) is required to log out"
      );
    });

    it('should call authService.logout and return success message on success', async () => {
      const req = { user: { uid: 'mockUid' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      authService.logout.mockResolvedValue();

      await authController.logout(req, res);

      expect(authService.logout).toHaveBeenCalledWith('mockUid');
      expect(responseHandler.success).toHaveBeenCalledWith(
        res,
        200,
        "User logged out successfully!"
      );
    });

    it('should handle errors from authService.logout', async () => {
      const req = { user: { uid: 'mockUid' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const errorMessage = "Logout error";

      authService.logout.mockRejectedValue(new Error(errorMessage));

      await authController.logout(req, res);

      expect(responseHandler.error).toHaveBeenCalledWith(
        res,
        500,
        errorMessage
      );
    });
  });
});
