jest.mock('../../config/db', () => ({ query: jest.fn(), getConnection: jest.fn() }));
jest.mock('../../services/products.service', () => ({ getProductsByIds: jest.fn() }));

const pool = require('../../config/db');
const { getProductsByIds } = require('../../services/products.service');
const ordersService = require('../../services/orders.service');

function mockConnection() {
  const connection = {
    beginTransaction: jest.fn(),
    query: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
  };
  pool.getConnection.mockResolvedValue(connection);
  return connection;
}

describe('createOrder', () => {
  beforeEach(() => jest.resetAllMocks());

  it('rejects an item referencing an unknown product', async () => {
    getProductsByIds.mockResolvedValue([]);
    mockConnection();

    await expect(
      ordersService.createOrder({ items: [{ productId: 'missing', quantity: 1 }], customerEmail: 'a@b.com' })
    ).rejects.toMatchObject({ status: 400 });
  });

  it('computes line totals and the order total, then commits', async () => {
    getProductsByIds.mockResolvedValue([{ id: 'p1', name: 'Wine', price: 9.99 }]);
    const connection = mockConnection();

    const order = await ordersService.createOrder({
      items: [{ productId: 'p1', quantity: 3 }],
      customerEmail: 'a@b.com',
      userId: 'user-1',
    });

    expect(order.items).toEqual([{ productId: 'p1', name: 'Wine', unitPrice: 9.99, quantity: 3, lineTotal: 29.97 }]);
    expect(order.total).toBe(29.97);
    expect(order.status).toBe('placed');
    expect(connection.beginTransaction).toHaveBeenCalled();
    expect(connection.commit).toHaveBeenCalled();
    expect(connection.rollback).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();
  });

  it('rolls back and releases the connection when an insert fails', async () => {
    getProductsByIds.mockResolvedValue([{ id: 'p1', name: 'Wine', price: 9.99 }]);
    const connection = mockConnection();
    connection.query.mockRejectedValue(new Error('db exploded'));

    await expect(
      ordersService.createOrder({ items: [{ productId: 'p1', quantity: 1 }], customerEmail: 'a@b.com' })
    ).rejects.toThrow('db exploded');

    expect(connection.rollback).toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();
  });
});

describe('getOrderById', () => {
  beforeEach(() => jest.resetAllMocks());

  it('returns null when the order does not exist', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    await expect(ordersService.getOrderById('missing')).resolves.toBeNull();
  });

  it('returns the order with its line items', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 'o1', total: 20 }]]).mockResolvedValueOnce([[{ productId: 'p1' }]]);
    await expect(ordersService.getOrderById('o1')).resolves.toEqual({
      id: 'o1',
      total: 20,
      items: [{ productId: 'p1' }],
    });
  });
});

describe('markOrderPaid', () => {
  beforeEach(() => jest.resetAllMocks());

  it('returns null when no row was updated', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    await expect(ordersService.markOrderPaid('missing')).resolves.toBeNull();
  });

  it('re-fetches the order after marking it paid', async () => {
    pool.query
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ id: 'o1', status: 'paid' }]])
      .mockResolvedValueOnce([[]]);
    await expect(ordersService.markOrderPaid('o1')).resolves.toEqual({ id: 'o1', status: 'paid', items: [] });
  });
});

describe('canAccessOrder', () => {
  it('allows access to a guest order (no owning user)', () => {
    expect(ordersService.canAccessOrder({ userId: null }, 'user-1')).toBe(true);
  });

  it('allows the owning user', () => {
    expect(ordersService.canAccessOrder({ userId: 'user-1' }, 'user-1')).toBe(true);
  });

  it('denies a different user', () => {
    expect(ordersService.canAccessOrder({ userId: 'user-1' }, 'user-2')).toBe(false);
  });
});
