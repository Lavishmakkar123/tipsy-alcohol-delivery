jest.mock('../../services/orders.service');
jest.mock('../../services/payments.service');
jest.mock('../../services/users.service');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const ordersService = require('../../services/orders.service');
const paymentsService = require('../../services/payments.service');
const usersService = require('../../services/users.service');
const app = require('../../app');

const token = (id = 'user-1') => jwt.sign({ id, email: 'a@b.com' }, process.env.JWT_SECRET);

describe('POST /api/orders', () => {
  beforeEach(() => jest.resetAllMocks());

  it('rejects an empty items array', async () => {
    const res = await request(app).post('/api/orders').send({ items: [], customerEmail: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('rejects malformed item entries', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ productId: 'p1', quantity: 0 }], customerEmail: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('rejects a missing customerEmail', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ productId: 'p1', quantity: 1 }] });
    expect(res.status).toBe(400);
  });

  it('creates an order for a guest checkout', async () => {
    ordersService.createOrder.mockResolvedValue({ id: 'o1', total: 20 });

    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ productId: 'p1', quantity: 2 }], customerEmail: 'a@b.com' });

    expect(res.status).toBe(201);
    expect(ordersService.createOrder).toHaveBeenCalledWith({
      items: [{ productId: 'p1', quantity: 2 }],
      customerEmail: 'a@b.com',
      userId: null,
    });
  });

  it('ties the order to the signed-in user when authenticated', async () => {
    ordersService.createOrder.mockResolvedValue({ id: 'o1', total: 20 });

    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token('user-9')}`)
      .send({ items: [{ productId: 'p1', quantity: 1 }], customerEmail: 'a@b.com' });

    expect(ordersService.createOrder).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-9' }));
  });

  it('surfaces a service error status and message', async () => {
    const err = new Error('Product out of stock');
    err.status = 422;
    ordersService.createOrder.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ productId: 'p1', quantity: 1 }], customerEmail: 'a@b.com' });

    expect(res.status).toBe(422);
    expect(res.body).toEqual({ error: 'Product out of stock' });
  });
});

describe('GET /api/orders/:id', () => {
  beforeEach(() => jest.resetAllMocks());

  it('returns 404 for an unknown order', async () => {
    ordersService.getOrderById.mockResolvedValue(null);
    const res = await request(app).get('/api/orders/o1');
    expect(res.status).toBe(404);
  });

  it('returns 403 when the order belongs to a different account', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1', userId: 'someone-else' });
    ordersService.canAccessOrder.mockReturnValue(false);
    const res = await request(app).get('/api/orders/o1').set('Authorization', `Bearer ${token()}`);
    expect(res.status).toBe(403);
  });

  it('returns the order when access is allowed', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1', userId: 'user-1' });
    ordersService.canAccessOrder.mockReturnValue(true);
    const res = await request(app).get('/api/orders/o1').set('Authorization', `Bearer ${token()}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'o1', userId: 'user-1' });
  });
});

describe('POST /api/orders/:id/payment-intent', () => {
  beforeEach(() => jest.resetAllMocks());

  it('creates a payment intent for an accessible order', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1', total: 20 });
    ordersService.canAccessOrder.mockReturnValue(true);
    paymentsService.createPaymentIntentForOrder.mockResolvedValue({ client_secret: 'secret_123' });

    const res = await request(app).post('/api/orders/o1/payment-intent');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ clientSecret: 'secret_123' });
  });

  it('propagates a Stripe configuration error', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1', total: 20 });
    ordersService.canAccessOrder.mockReturnValue(true);
    const err = new Error('Stripe is not configured (missing STRIPE_SECRET_KEY)');
    err.status = 500;
    paymentsService.createPaymentIntentForOrder.mockRejectedValue(err);

    const res = await request(app).post('/api/orders/o1/payment-intent');

    expect(res.status).toBe(500);
  });
});

describe('POST /api/orders/:id/confirm-payment', () => {
  beforeEach(() => jest.resetAllMocks());

  it('requires a paymentIntentId', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1' });
    ordersService.canAccessOrder.mockReturnValue(true);
    const res = await request(app).post('/api/orders/o1/confirm-payment').send({});
    expect(res.status).toBe(400);
  });

  it('rejects a payment intent that does not match the order', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1' });
    ordersService.canAccessOrder.mockReturnValue(true);
    paymentsService.retrievePaymentIntent.mockResolvedValue({ metadata: { orderId: 'different-order' } });

    const res = await request(app).post('/api/orders/o1/confirm-payment').send({ paymentIntentId: 'pi_1' });

    expect(res.status).toBe(400);
  });

  it('rejects an intent that has not succeeded', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1' });
    ordersService.canAccessOrder.mockReturnValue(true);
    paymentsService.retrievePaymentIntent.mockResolvedValue({ metadata: { orderId: 'o1' }, status: 'processing' });

    const res = await request(app).post('/api/orders/o1/confirm-payment').send({ paymentIntentId: 'pi_1' });

    expect(res.status).toBe(400);
  });

  it('marks the order paid and awards loyalty points for a succeeded intent', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1' });
    ordersService.canAccessOrder.mockReturnValue(true);
    paymentsService.retrievePaymentIntent.mockResolvedValue({ metadata: { orderId: 'o1' }, status: 'succeeded' });
    ordersService.markOrderPaid.mockResolvedValue({ id: 'o1', userId: 'user-1', total: 42 });

    const res = await request(app).post('/api/orders/o1/confirm-payment').send({ paymentIntentId: 'pi_1' });

    expect(res.status).toBe(200);
    expect(usersService.awardPoints).toHaveBeenCalledWith('user-1', 42);
  });

  it('skips awarding points for a guest order', async () => {
    ordersService.getOrderById.mockResolvedValue({ id: 'o1' });
    ordersService.canAccessOrder.mockReturnValue(true);
    paymentsService.retrievePaymentIntent.mockResolvedValue({ metadata: { orderId: 'o1' }, status: 'succeeded' });
    ordersService.markOrderPaid.mockResolvedValue({ id: 'o1', userId: null, total: 42 });

    const res = await request(app).post('/api/orders/o1/confirm-payment').send({ paymentIntentId: 'pi_1' });

    expect(res.status).toBe(200);
    expect(usersService.awardPoints).not.toHaveBeenCalled();
  });
});
