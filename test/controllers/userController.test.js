const { getMe, getRecentlyViewed } = require('../../src/controllers/userController');
const userService = require('../../src/services/userService');
const cacheService = require('../../src/services/cacheService');
const responseHandler = require('../../src/utils/responseHandler');

jest.mock('../../src/services/userService');
jest.mock('../../src/services/cacheService');
jest.mock('../../src/utils/responseHandler');
console.error = jest.fn();
jest.mock('../../src/redisClient', () => {
  const mockRedisClient = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };
  return mockRedisClient;
});

describe('User Controller', () => {
  describe('getMe', () => {
    const mockReq = {
      user: { uid: 'mockUserId' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return user data if user exists', async () => {
      const mockUserData = { id: 'mockUserId', name: 'John Doe' };
      userService.getUserById.mockResolvedValue(mockUserData);

      await getMe(mockReq, mockRes);

      expect(userService.getUserById).toHaveBeenCalledWith('mockUserId');
      expect(responseHandler.success).toHaveBeenCalledWith(mockRes, 200, 'Welcome, authenticated user!', {
        userId: 'mockUserId',
        userData: mockUserData,
      });
    });

    it('should return 404 if user does not exist', async () => {
      userService.getUserById.mockResolvedValue(null);

      await getMe(mockReq, mockRes);

      expect(responseHandler.error).toHaveBeenCalledWith(mockRes, 404, 'User not found');
    });

    it('should return 500 if there is an error fetching user data', async () => {
      const error = new Error('Database error');
      userService.getUserById.mockRejectedValue(error);

      await getMe(mockReq, mockRes);

      expect(responseHandler.error).toHaveBeenCalledWith(mockRes, 500, 'Internal Server Error');
    });
  });

  describe('getRecentlyViewed', () => {
    const mockReq = {
      user: { uid: 'mockUserId' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return cached recently viewed products if available', async () => {
      const mockCachedData = [{ productId: '1', productName: 'Product 1' }];
      cacheService.getFromCache.mockResolvedValue(mockCachedData);

      await getRecentlyViewed(mockReq, mockRes);

      expect(cacheService.getFromCache).toHaveBeenCalledWith('recentlyViewed:mockUserId');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCachedData);
    });

    it('should fetch and cache recently viewed products if not in cache', async () => {
      const mockRecentlyViewed = [{ productId: '2', productName: 'Product 2' }];
      cacheService.getFromCache.mockResolvedValue(null);
      userService.getRecentlyViewed.mockResolvedValue(mockRecentlyViewed);

      await getRecentlyViewed(mockReq, mockRes);

      expect(userService.getRecentlyViewed).toHaveBeenCalledWith('mockUserId');
      expect(cacheService.saveToCache).toHaveBeenCalledWith('recentlyViewed:mockUserId', mockRecentlyViewed);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockRecentlyViewed);
    });

    it('should return 500 if there is an error fetching recently viewed products', async () => {
      const error = new Error('Failed to fetch data');
      cacheService.getFromCache.mockResolvedValue(null);
      userService.getRecentlyViewed.mockRejectedValue(error);

      await getRecentlyViewed(mockReq, mockRes);

      expect(console.error).toHaveBeenCalledWith('Error in getRecentlyViewed:', error.message);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch recently viewed products' });
    });
  });
});
