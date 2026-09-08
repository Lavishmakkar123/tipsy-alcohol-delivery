jest.mock('../../services/products.service');

const request = require('supertest');
const productsService = require('../../services/products.service');
const app = require('../../app');

describe('GET /api/products', () => {
  beforeEach(() => jest.resetAllMocks());

  it('lists products, forwarding query filters', async () => {
    productsService.listProducts.mockResolvedValue([{ id: '1', name: 'Wine' }]);

    const res = await request(app).get('/api/products').query({ category: 'wine', q: 'red' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1', name: 'Wine' }]);
    expect(productsService.listProducts).toHaveBeenCalledWith({ category: 'wine', q: 'red' });
  });
});

describe('GET /api/products/:id', () => {
  beforeEach(() => jest.resetAllMocks());

  it('returns 404 for an unknown product', async () => {
    productsService.getProductById.mockResolvedValue(null);
    const res = await request(app).get('/api/products/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns the product when found', async () => {
    productsService.getProductById.mockResolvedValue({ id: '1', name: 'Wine' });
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '1', name: 'Wine' });
  });
});
