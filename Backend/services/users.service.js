const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  await pool.query('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, email, passwordHash]);
  return { id, email, passwordHash, loyaltyPoints: 0 };
}

async function findByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, email, password_hash AS passwordHash, loyalty_points AS loyaltyPoints FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, email, password_hash AS passwordHash, loyalty_points AS loyaltyPoints FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/** 1 point per whole dollar spent — awarded once an order's payment is confirmed. */
async function awardPoints(userId, orderTotal) {
  const points = Math.floor(orderTotal);
  if (points <= 0) return;
  await pool.query('UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?', [points, userId]);
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

/** Gets-or-creates a user with no password — used for OAuth sign-ins, where
 * the identity was already proven by Google/Facebook rather than a password. */
async function findOrCreateByEmail(email) {
  const existing = await findByEmail(email);
  if (existing) return existing;
  const id = randomUUID();
  await pool.query('INSERT INTO users (id, email, password_hash) VALUES (?, ?, NULL)', [id, email]);
  return { id, email, passwordHash: null, loyaltyPoints: 0 };
}

module.exports = { createUser, findByEmail, findById, verifyPassword, findOrCreateByEmail, awardPoints };
