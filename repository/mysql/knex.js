// db.js
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE // ✅ Only one connection needed
  },
  pool: { min: 0, max: 7 }
});

// Test the connection
db.raw('SELECT 1+1 AS result')
  .then(() => console.log('✅ Connected to MySQL successfully!'))
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
    process.exit(1);
  });

module.exports = db;
