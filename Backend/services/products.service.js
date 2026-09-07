const pool = require('../config/db');

async function listProducts({ category, q } = {}) {
  const clauses = [];
  const params = [];

  if (category) {
    clauses.push('category = ?');
    params.push(category);
  }
  if (q) {
    clauses.push('LOWER(name) LIKE ?');
    params.push(`%${q.toLowerCase()}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const [rows] = await pool.query(`SELECT * FROM products ${where} ORDER BY name`, params);
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0] || null;
}

async function getProductsByIds(ids) {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(', ');
  const [rows] = await pool.query(`SELECT * FROM products WHERE id IN (${placeholders})`, ids);
  return rows;
}

module.exports = { listProducts, getProductById, getProductsByIds };
