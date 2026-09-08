jest.mock('../../services/wishlist.service');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const wishlistService = require('../../services/wishlist.service');
const app = require('../../app');

const token = () => jwt.sign({ id: 'user-1', email: 'a@b.com' }, process.env.JWT_SECRET);

describe('wishlist routes', () => {
  beforeEach(() => jest.resetAllMocks());

  it('requires authentication to list the wishlist', async () => {
    const res = await request(app).get('/api/wishlist');
    expect(res.status).toBe(401);
  });

  it('lists the current user wishlist', async () => {
    wishlistService.getWishlist.mockResolvedValue([{ id: 'p1', name: 'Rum' }]);

    const res = await request(app).get('/api/wishlist').set('Authorization', `Bearer ${token()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'p1', name: 'Rum' }]);
    expect(wishlistService.getWishlist).toHaveBeenCalledWith('user-1');
  });

  it('adds an item to the wishlist', async () => {
    wishlistService.addToWishlist.mockResolvedValue();

    const res = await request(app).post('/api/wishlist/p1').set('Authorization', `Bearer ${token()}`);

    expect(res.status).toBe(204);
    expect(wishlistService.addToWishlist).toHaveBeenCalledWith('user-1', 'p1');
  });

  it('removes an item from the wishlist', async () => {
    wishlistService.removeFromWishlist.mockResolvedValue();

    const res = await request(app).delete('/api/wishlist/p1').set('Authorization', `Bearer ${token()}`);

    expect(res.status).toBe(204);
    expect(wishlistService.removeFromWishlist).toHaveBeenCalledWith('user-1', 'p1');
  });
});
