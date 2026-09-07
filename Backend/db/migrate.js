require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const products = require('./seed-products');

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
