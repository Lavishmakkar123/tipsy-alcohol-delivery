const express = require('express');
const { createOrder, getOrder, createPaymentIntent, confirmPayment } = require('../controllers/orders.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/:id', optionalAuth, getOrder);
router.post('/:id/payment-intent', optionalAuth, createPaymentIntent);
router.post('/:id/confirm-payment', optionalAuth, confirmPayment);

module.exports = router;
