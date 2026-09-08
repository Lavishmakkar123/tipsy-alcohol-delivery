const jwt = require('jsonwebtoken');
const usersService = require('../services/users.service');

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function isValidCredentials(email, password) {
  return typeof email === 'string' && email.includes('@') && typeof password === 'string' && password.length >= 6;
}

async function register(req, res) {
  const { email, password } = req.body;
  if (!isValidCredentials(email, password)) {
    return res.status(400).json({ error: 'A valid email and a password of at least 6 characters are required' });
  }

  const existing = await usersService.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }

  const user = await usersService.createUser(email, password);
  res
    .status(201)
    .json({ token: signToken(user), user: { id: user.id, email: user.email, loyaltyPoints: user.loyaltyPoints } });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await usersService.findByEmail(email);
  if (!user || !user.passwordHash || !(await usersService.verifyPassword(user, password))) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }

  res.json({ token: signToken(user), user: { id: user.id, email: user.email, loyaltyPoints: user.loyaltyPoints } });
}

/**
 * Issues our own JWT for a user who already proved their identity via an
 * OAuth provider (Google/Facebook) on the frontend. This trusts the email
 * the client hands it rather than independently re-verifying the provider's
 * token server-side — a real production build should verify the Google ID
 * token / Facebook access token here before trusting the email at all.
 */
async function socialLogin(req, res) {
  const { email } = req.body;
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  const user = await usersService.findOrCreateByEmail(email);
  res.json({ token: signToken(user), user: { id: user.id, email: user.email, loyaltyPoints: user.loyaltyPoints } });
}

async function me(req, res) {
  const user = await usersService.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, email: user.email, loyaltyPoints: user.loyaltyPoints });
}

module.exports = { register, login, socialLogin, me };
