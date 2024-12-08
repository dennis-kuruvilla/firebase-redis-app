const { signup, login, logout } = require('../../src/services/authService');
const axios = require('axios');
const { admin, db } = require('../../src/config/firebaseConfig');

jest.mock('axios');
jest.mock('../../src/config/firebaseConfig');

const mockCreateUser = jest.fn();
const mockRevokeRefreshTokens = jest.fn();
const mockSet = jest.fn();

const mockFieldValue = {
  serverTimestamp: jest.fn().mockReturnValue('mockTimestamp'),
};

admin.auth = jest.fn().mockReturnValue({
  createUser: mockCreateUser,
  revokeRefreshTokens: mockRevokeRefreshTokens,
});

admin.firestore = jest.fn().mockReturnValue({
  FieldValue: mockFieldValue,
});

db.collection = jest.fn().mockReturnValue({
  doc: jest.fn().mockReturnValue({
    set: mockSet,
  }),
});

describe('Auth Service', () => {
  describe('signup', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userRecord = {
      uid: 'mockUid',
      email: email,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if user creation fails', async () => {
      const error = new Error('User creation failed');
      mockCreateUser.mockRejectedValue(error);

      await expect(signup(email, password)).rejects.toThrow('User creation failed');
    });
  });

  describe('login', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const idToken = 'mockIdToken';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.FIREBASE_API_KEY = 'mockApiKey';
    });

    it('should return an idToken on successful login', async () => {
      axios.post.mockResolvedValue({
        data: { idToken },
      });

      const token = await login(email, password);

      expect(axios.post).toHaveBeenCalledWith(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=mockApiKey',
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
      expect(token).toBe(idToken);
    });

    it('should throw an error if login fails', async () => {
      const error = new Error('Login failed');
      axios.post.mockRejectedValue(error);

      await expect(login(email, password)).rejects.toThrow('Login failed');
    });
  });

  describe('logout', () => {
    const uid = 'mockUid';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should revoke refresh tokens on logout', async () => {
      await logout(uid);

      expect(admin.auth().revokeRefreshTokens).toHaveBeenCalledWith(uid);
    });

    it('should throw an error if logout fails', async () => {
      const error = new Error('Logout failed');
      mockRevokeRefreshTokens.mockRejectedValue(error);

      await expect(logout(uid)).rejects.toThrow('Logout failed');
    });
  });
});
