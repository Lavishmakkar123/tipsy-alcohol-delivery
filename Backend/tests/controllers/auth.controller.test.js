jest.mock('../../services/users.service');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const usersService = require('../../services/users.service');
const app = require('../../app');

describe('POST /api/auth/register', () => {
  beforeEach(() => jest.resetAllMocks());

  it('rejects an invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'not-an-email', password: 'password123' });
    expect(res.status).toBe(400);
  });

  it('rejects a short password', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('rejects a duplicate email with 409', async () => {
    usersService.findByEmail.mockResolvedValue({ id: '1', email: 'a@b.com' });
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'password123' });
    expect(res.status).toBe(409);
  });

  it('creates a user and returns a token', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.createUser.mockResolvedValue({ id: '1', email: 'a@b.com', loyaltyPoints: 0 });

    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.user).toEqual({ id: '1', email: 'a@b.com', loyaltyPoints: 0 });
    expect(typeof res.body.token).toBe('string');
    expect(() => jwt.verify(res.body.token, process.env.JWT_SECRET)).not.toThrow();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => jest.resetAllMocks());

  it('rejects missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('rejects an unknown email with 401 (no user enumeration)', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ email: 'nope@b.com', password: 'password123' });
    expect(res.status).toBe(401);
  });

  it('rejects an incorrect password with 401', async () => {
    usersService.findByEmail.mockResolvedValue({ id: '1', email: 'a@b.com', passwordHash: 'hash' });
    usersService.verifyPassword.mockResolvedValue(false);
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('logs in successfully with valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({ id: '1', email: 'a@b.com', passwordHash: 'hash', loyaltyPoints: 5 });
    usersService.verifyPassword.mockResolvedValue(true);
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.user.loyaltyPoints).toBe(5);
  });
});

describe('GET /api/auth/me', () => {
  beforeEach(() => jest.resetAllMocks());

  it('requires authentication', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the current user for a valid token', async () => {
    usersService.findById.mockResolvedValue({ id: '1', email: 'a@b.com', loyaltyPoints: 2 });
    const token = jwt.sign({ id: '1', email: 'a@b.com' }, process.env.JWT_SECRET);

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '1', email: 'a@b.com', loyaltyPoints: 2 });
  });
});
