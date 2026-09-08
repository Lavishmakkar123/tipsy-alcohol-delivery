const pool = require('../config/db');

async function getWishlist(userId) {
  const [rows] = await pool.query(
    `SELECT p.* FROM wishlist_items w
     JOIN products p ON p.id = w.product_id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`,
    [userId]
  );
  return rows;
}

async function addToWishlist(userId, productId) {
  await pool.query('INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)', [userId, productId]);
}

async function removeFromWishlist(userId, productId) {
  await pool.query('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
