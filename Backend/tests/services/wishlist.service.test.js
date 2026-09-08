jest.mock('../../config/db', () => ({ query: jest.fn() }));

const pool = require('../../config/db');
const wishlistService = require('../../services/wishlist.service');

describe('wishlist.service', () => {
  beforeEach(() => jest.resetAllMocks());

  it('gets the wishlist for a user', async () => {
    pool.query.mockResolvedValue([[{ id: 'p1' }]]);
    const result = await wishlistService.getWishlist('user-1');
    expect(result).toEqual([{ id: 'p1' }]);
    expect(pool.query.mock.calls[0][1]).toEqual(['user-1']);
  });

  it('adds an item to the wishlist', async () => {
    pool.query.mockResolvedValue([{}]);
    await wishlistService.addToWishlist('user-1', 'p1');
    expect(pool.query).toHaveBeenCalledWith('INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)', [
      'user-1',
      'p1',
    ]);
  });

  it('removes an item from the wishlist', async () => {
    pool.query.mockResolvedValue([{}]);
    await wishlistService.removeFromWishlist('user-1', 'p1');
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?', [
      'user-1',
      'p1',
    ]);
  });
});
