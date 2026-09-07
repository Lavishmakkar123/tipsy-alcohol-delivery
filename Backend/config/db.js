const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // Without this, DECIMAL columns (product prices, order totals) come back
  // as strings — every `.toFixed()` and price * quantity in the app assumes
  // a real number.
  decimalNumbers: true,
});

module.exports = pool;
