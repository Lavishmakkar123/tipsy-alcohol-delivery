const Stripe = require('stripe');

let stripe = null;
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

async function createPaymentIntentForOrder(order) {
  const client = getStripe();
  if (!client) {
    const error = new Error('Stripe is not configured (missing STRIPE_SECRET_KEY)');
    error.status = 500;
    throw error;
  }

  const amountInCents = Math.round(order.total * 100);

  const intent = await client.paymentIntents.create({
    amount: amountInCents,
    currency: 'cad',
    metadata: { orderId: order.id },
    receipt_email: order.customerEmail,
  });

  return intent;
}

async function retrievePaymentIntent(paymentIntentId) {
  const client = getStripe();
  if (!client) {
    const error = new Error('Stripe is not configured (missing STRIPE_SECRET_KEY)');
    error.status = 500;
    throw error;
  }
  return client.paymentIntents.retrieve(paymentIntentId);
}

module.exports = { createPaymentIntentForOrder, retrievePaymentIntent };
