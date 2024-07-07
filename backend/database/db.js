const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
    throw err;
  }
};

const verifyConnection = async () => {
  try {
    // Verify current database
    const dbResult = await pool.query('SELECT current_database()');
    const currentDatabase = dbResult.rows[0].current_database;
    console.log('Connected to database:', currentDatabase);

    // List tables in the current database
    const tableResult = await pool.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');
    const tables = tableResult.rows.map(row => row.tablename);
    console.log('Tables in this database:', tables);

    return { currentDatabase, tables };
  } catch (err) {
    console.error('Error verifying connection:', err);
    throw err;
  }
};

module.exports = {
  connectToDatabase,
  verifyConnection,
};
