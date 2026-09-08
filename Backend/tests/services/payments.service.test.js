const mockCreate = jest.fn();
const mockRetrieve = jest.fn();

jest.mock('stripe', () =>
  jest.fn().mockImplementation(() => ({
    paymentIntents: { create: mockCreate, retrieve: mockRetrieve },
  }))
);

describe('payments.service', () => {
  const originalKey = process.env.STRIPE_SECRET_KEY;

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = originalKey;
  });

  it('throws a 500 when Stripe is not configured', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const paymentsService = require('../../services/payments.service');

    await expect(paymentsService.createPaymentIntentForOrder({ total: 10 })).rejects.toMatchObject({ status: 500 });
    await expect(paymentsService.retrievePaymentIntent('pi_1')).rejects.toMatchObject({ status: 500 });
  });

  it('creates a payment intent in cents with order metadata', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    mockCreate.mockResolvedValue({ client_secret: 'secret' });
    const paymentsService = require('../../services/payments.service');

    const result = await paymentsService.createPaymentIntentForOrder({
      id: 'o1',
      total: 19.99,
      customerEmail: 'a@b.com',
    });

    expect(mockCreate).toHaveBeenCalledWith({
      amount: 1999,
      currency: 'cad',
      metadata: { orderId: 'o1' },
      receipt_email: 'a@b.com',
    });
    expect(result).toEqual({ client_secret: 'secret' });
  });

  it('retrieves a payment intent by id', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    mockRetrieve.mockResolvedValue({ id: 'pi_1', status: 'succeeded' });
    const paymentsService = require('../../services/payments.service');

    await expect(paymentsService.retrievePaymentIntent('pi_1')).resolves.toEqual({
      id: 'pi_1',
      status: 'succeeded',
    });
    expect(mockRetrieve).toHaveBeenCalledWith('pi_1');
  });
});
