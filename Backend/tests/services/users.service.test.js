jest.mock('../../config/db', () => ({ query: jest.fn() }));
jest.mock('bcryptjs', () => ({ hash: jest.fn(), compare: jest.fn() }));

const bcrypt = require('bcryptjs');
const pool = require('../../config/db');
const usersService = require('../../services/users.service');

describe('users.service', () => {
  beforeEach(() => jest.resetAllMocks());

  it('hashes the password and inserts a new user', async () => {
    bcrypt.hash.mockResolvedValue('hashed-password');
    pool.query.mockResolvedValue([{}]);

    const user = await usersService.createUser('a@b.com', 'password123');

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [
      user.id,
      'a@b.com',
      'hashed-password',
    ]);
    expect(user).toMatchObject({ email: 'a@b.com', passwordHash: 'hashed-password', loyaltyPoints: 0 });
  });

  it('finds a user by email, or returns null', async () => {
    pool.query.mockResolvedValueOnce([[{ id: '1', email: 'a@b.com' }]]);
    await expect(usersService.findByEmail('a@b.com')).resolves.toEqual({ id: '1', email: 'a@b.com' });

    pool.query.mockResolvedValueOnce([[]]);
    await expect(usersService.findByEmail('missing@b.com')).resolves.toBeNull();
  });

  it('finds a user by id, or returns null', async () => {
    pool.query.mockResolvedValueOnce([[{ id: '1' }]]);
    await expect(usersService.findById('1')).resolves.toEqual({ id: '1' });

    pool.query.mockResolvedValueOnce([[]]);
    await expect(usersService.findById('missing')).resolves.toBeNull();
  });

  it('awards a whole number of points per dollar spent', async () => {
    pool.query.mockResolvedValue([{}]);
    await usersService.awardPoints('user-1', 19.75);
    expect(pool.query).toHaveBeenCalledWith('UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?', [
      19,
      'user-1',
    ]);
  });

  it('skips the update when there are no points to award', async () => {
    await usersService.awardPoints('user-1', 0);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('verifies a password via bcrypt.compare', async () => {
    bcrypt.compare.mockResolvedValue(true);
    const result = await usersService.verifyPassword({ passwordHash: 'hash' }, 'plain');
    expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hash');
    expect(result).toBe(true);
  });

  it('findOrCreateByEmail returns the existing user without inserting', async () => {
    pool.query.mockResolvedValueOnce([[{ id: '1', email: 'a@b.com' }]]);
    const user = await usersService.findOrCreateByEmail('a@b.com');
    expect(user).toEqual({ id: '1', email: 'a@b.com' });
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it('findOrCreateByEmail creates a passwordless user when none exists', async () => {
    pool.query.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{}]);
    const user = await usersService.findOrCreateByEmail('new@b.com');
    expect(user).toMatchObject({ email: 'new@b.com', passwordHash: null, loyaltyPoints: 0 });
    expect(pool.query).toHaveBeenLastCalledWith('INSERT INTO users (id, email, password_hash) VALUES (?, ?, NULL)', [
      user.id,
      'new@b.com',
    ]);
  });
});
