jest.mock('../../config/db', () => ({ query: jest.fn() }));

const pool = require('../../config/db');
const productsService = require('../../services/products.service');

describe('products.service', () => {
  beforeEach(() => jest.resetAllMocks());

  it('lists all products with no filters', async () => {
    pool.query.mockResolvedValue([[{ id: '1' }]]);
    const result = await productsService.listProducts({});
    expect(result).toEqual([{ id: '1' }]);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products  ORDER BY name', []);
  });

  it('filters by category', async () => {
    pool.query.mockResolvedValue([[]]);
    await productsService.listProducts({ category: 'wine' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE category = ? ORDER BY name', ['wine']);
  });

  it('filters by search term, case-insensitively', async () => {
    pool.query.mockResolvedValue([[]]);
    await productsService.listProducts({ q: 'ROSE' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE LOWER(name) LIKE ? ORDER BY name', [
      '%rose%',
    ]);
  });

  it('combines category and search filters', async () => {
    pool.query.mockResolvedValue([[]]);
    await productsService.listProducts({ category: 'wine', q: 'rose' });
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM products WHERE category = ? AND LOWER(name) LIKE ? ORDER BY name',
      ['wine', '%rose%']
    );
  });

  it('returns a single product by id, or null when missing', async () => {
    pool.query.mockResolvedValueOnce([[{ id: '1' }]]);
    await expect(productsService.getProductById('1')).resolves.toEqual({ id: '1' });

    pool.query.mockResolvedValueOnce([[]]);
    await expect(productsService.getProductById('missing')).resolves.toBeNull();
  });

  it('returns an empty array for getProductsByIds([])', async () => {
    await expect(productsService.getProductsByIds([])).resolves.toEqual([]);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('builds an IN clause for getProductsByIds', async () => {
    pool.query.mockResolvedValue([[{ id: '1' }, { id: '2' }]]);
    const result = await productsService.getProductsByIds(['1', '2']);
    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id IN (?, ?)', ['1', '2']);
  });
});
