const productController = require('../../src/controllers/productController');
const productService = require('../../src/services/productService');
const userService = require('../../src/services/userService');
const cacheService = require('../../src/services/cacheService');

jest.mock('../../src/services/productService');
jest.mock('../../src/services/userService');
jest.mock('../../src/services/cacheService');
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

describe('Product Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, user: { uid: 'user123' } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product and return 201 with the product data', async () => {
      const mockProduct = { name: 'Test Product', price: 100 };
      const createdProduct = { id: 1, ...mockProduct, createdBy: 'user123' };

      productService.createProduct.mockResolvedValue(createdProduct);

      mockReq.body = mockProduct;

      await productController.createProduct(mockReq, mockRes);

      expect(productService.createProduct).toHaveBeenCalledWith({ ...mockProduct, createdBy: 'user123' });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdProduct);
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Error creating product';
      productService.createProduct.mockRejectedValue(new Error(errorMessage));

      await productController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getProduct', () => {
    it('should return the product and handle recently viewed logic', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      mockReq.params.productId = '1';

      productService.getProductById.mockResolvedValue(mockProduct);
      userService.addRecentlyViewedProduct.mockResolvedValue();
      cacheService.deleteFromCache.mockResolvedValue();

      await productController.getProduct(mockReq, mockRes);

      expect(productService.getProductById).toHaveBeenCalledWith('1');
      expect(userService.addRecentlyViewedProduct).toHaveBeenCalledWith('user123', '1');
      expect(cacheService.deleteFromCache).toHaveBeenCalledWith('recentlyViewed:user123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle errors and return 404', async () => {
      const errorMessage = 'Product not found';
      productService.getProductById.mockRejectedValue(new Error(errorMessage));

      await productController.getProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];

      productService.getAllProducts.mockResolvedValue(mockProducts);

      await productController.getAllProducts(mockReq, mockRes);

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Error fetching products';
      productService.getAllProducts.mockRejectedValue(new Error(errorMessage));

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return the updated data', async () => {
      const updatedProduct = { id: 1, name: 'Updated Product', price: 120 };
      mockReq.params.productId = '1';
      mockReq.body = { name: 'Updated Product', price: 120 };

      productService.updateProduct.mockResolvedValue(updatedProduct);

      await productController.updateProduct(mockReq, mockRes);

      expect(productService.updateProduct).toHaveBeenCalledWith('1', mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should handle errors and return 404', async () => {
      const errorMessage = 'Product not found';
      productService.updateProduct.mockRejectedValue(new Error(errorMessage));

      await productController.updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return a success response', async () => {
      const mockResponse = { success: true };
      mockReq.params.productId = '1';

      productService.deleteProduct.mockResolvedValue(mockResponse);

      await productController.deleteProduct(mockReq, mockRes);

      expect(productService.deleteProduct).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle errors and return 404', async () => {
      const errorMessage = 'Product not found';
      productService.deleteProduct.mockRejectedValue(new Error(errorMessage));

      await productController.deleteProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

})
