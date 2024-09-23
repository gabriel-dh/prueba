const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Prueba de conexión
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error conectando a la base de datos:', err.stack);
  }
  console.log('Conexión exitosa a la base de datos');
  release();  // Libera el cliente
});

module.exports = pool;
