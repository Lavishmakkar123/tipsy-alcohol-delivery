require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const products = require('./seed-products');

// MySQL (unlike MariaDB) has no `ADD COLUMN IF NOT EXISTS`, so columns added
// to a table after its first release need this instead of living in
// schema.sql directly — check information_schema, only alter if missing.
async function addColumnIfMissing(connection, table, column, definition) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS count FROM information_schema.COLUMNS
     WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
    [process.env.DB_NAME, table, column]
  );
  if (rows[0].count > 0) return;
  console.log(`Adding column ${table}.${column}...`);
  await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  console.log('Applying schema...');
  await connection.query(schema);

  await addColumnIfMissing(connection, 'users', 'loyalty_points', 'INT NOT NULL DEFAULT 0');

  console.log(`Seeding ${products.length} products...`);
  for (const p of products) {
    await connection.query(
      `INSERT INTO products (id, name, category, price, size, description)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category),
         price = VALUES(price), size = VALUES(size), description = VALUES(description)`,
      [p.id, p.name, p.category, p.price, p.size, p.description]
    );
  }

  console.log('Done.');
  await connection.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
