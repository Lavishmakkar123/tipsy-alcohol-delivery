# Database Conventions

- `config/db.js` exports a single `mysql2/promise` connection pool
  (`waitForConnections: true`, `connectionLimit: 10`). Import that pool in a
  service — never create a second pool or a raw `mysql.createConnection`
  elsewhere.
- `decimalNumbers: true` is set deliberately so DECIMAL columns (prices,
  order totals) come back as real JS numbers, not strings — every
  `.toFixed()` and `price * quantity` in the app depends on this. Don't
  remove it.
- **Always use parameterized queries** (`pool.query(sql, [params])`) — never
  string-interpolate request data into SQL. This is non-negotiable; it's the
  entire SQL-injection defense for this app.
- Multi-statement writes that must succeed or fail together (e.g. an order
  plus its line items) use a transaction: `pool.getConnection()` →
  `beginTransaction()` → queries on `connection` (not `pool`) → `commit()`,
  with `rollback()` in a `catch` and `release()` in a `finally`. See
  `orders.service.js`'s `createOrder` for the reference implementation.
- Schema lives in `db/schema.sql`; apply/update it via `db/migrate.js`.
  Seed data (the product catalog) comes from `db/seed-products.js`. Keep
  `schema.sql` as the source of truth — if you add a column or table, update
  it there, not just in a one-off migration script.
- Local development uses the `docker-compose.yml` MySQL service; `DB_PASSWORD`
  in `.env` doubles as the container's root password on first start.
