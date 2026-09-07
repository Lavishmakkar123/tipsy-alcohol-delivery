const { randomUUID } = require('crypto');
const pool = require('../config/db');
const { getProductsByIds } = require('./products.service');

async function createOrder({ items, customerEmail, userId = null }) {
  const products = await getProductsByIds(items.map((item) => item.productId));

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      const error = new Error(`Unknown product: ${item.productId}`);
      error.status = 400;
      throw error;
    }
    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: Math.round(product.price * item.quantity * 100) / 100,
    };
  });

  const total = Math.round(lineItems.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;
  const id = randomUUID();
  const createdAt = new Date();

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      'INSERT INTO orders (id, user_id, customer_email, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, userId, customerEmail, total, 'placed', createdAt]
    );
    for (const item of lineItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, name, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?)',
        [id, item.productId, item.name, item.unitPrice, item.quantity, item.lineTotal]
      );
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  return { id, userId, customerEmail, items: lineItems, total, status: 'placed', createdAt: createdAt.toISOString() };
}

async function getOrderById(id) {
  const [orderRows] = await pool.query(
    'SELECT id, user_id AS userId, customer_email AS customerEmail, total, status, created_at AS createdAt FROM orders WHERE id = ?',
    [id]
  );
  const order = orderRows[0];
  if (!order) return null;

  const [items] = await pool.query(
    'SELECT product_id AS productId, name, unit_price AS unitPrice, quantity, line_total AS lineTotal FROM order_items WHERE order_id = ?',
    [id]
  );
  return { ...order, items };
}

async function markOrderPaid(id) {
  const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['paid', id]);
  if (result.affectedRows === 0) return null;
  return getOrderById(id);
}

/** True if the order was placed as a guest, or by the given user. */
function canAccessOrder(order, userId) {
  return !order.userId || order.userId === userId;
}

module.exports = { createOrder, getOrderById, markOrderPaid, canAccessOrder };
