const ordersService = require('../services/orders.service');
const paymentsService = require('../services/payments.service');

function isValidItems(items) {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item &&
        typeof item.productId === 'string' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    )
  );
}

async function createOrder(req, res) {
  const { items, customerEmail } = req.body;

  if (!isValidItems(items)) {
    return res.status(400).json({ error: 'items must be a non-empty array of { productId, quantity }' });
  }
  if (typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
    return res.status(400).json({ error: 'customerEmail is required' });
  }

  try {
    // req.user is set only when the request carried a valid JWT (optionalAuth) —
    // guests can still check out, but a signed-in user's order is tied to their
    // account and protected by canAccessOrder below.
    const order = await ordersService.createOrder({ items, customerEmail, userId: req.user?.id ?? null });
    res.status(201).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to create order' });
  }
}

async function getOrder(req, res) {
  const order = await ordersService.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (!ordersService.canAccessOrder(order, req.user?.id)) {
    return res.status(403).json({ error: 'This order belongs to a different account' });
  }
  res.json(order);
}

async function createPaymentIntent(req, res) {
  const order = await ordersService.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (!ordersService.canAccessOrder(order, req.user?.id)) {
    return res.status(403).json({ error: 'This order belongs to a different account' });
  }

  try {
    const intent = await paymentsService.createPaymentIntentForOrder(order);
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to create payment intent' });
  }
}

/**
 * Confirms an order was actually paid before marking it so. Trusts Stripe's
 * own record of the PaymentIntent's status, not whatever the client claims —
 * a client calling this with a fabricated or unrelated intent id gets 400s.
 */
async function confirmPayment(req, res) {
  const order = await ordersService.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (!ordersService.canAccessOrder(order, req.user?.id)) {
    return res.status(403).json({ error: 'This order belongs to a different account' });
  }

  const { paymentIntentId } = req.body;
  if (typeof paymentIntentId !== 'string' || !paymentIntentId) {
    return res.status(400).json({ error: 'paymentIntentId is required' });
  }

  try {
    const intent = await paymentsService.retrievePaymentIntent(paymentIntentId);
    if (intent.metadata.orderId !== order.id) {
      return res.status(400).json({ error: 'paymentIntentId does not match this order' });
    }
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment not completed (status: ${intent.status})` });
    }
    const paid = await ordersService.markOrderPaid(order.id);
    res.json(paid);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to confirm payment' });
  }
}

module.exports = { createOrder, getOrder, createPaymentIntent, confirmPayment };
