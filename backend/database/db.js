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

const insertPostData = async (data) => {
  const { category, content, imageUri, rating, review, timestamp, username } = data;

  const { tables } = await verifyConnection(); // Call verifyConnection here

  if (!tables.includes('posts')) {
    console.error('Table "posts" does not exist in the database');
    throw new Error('Table "posts" does not exist in the database');
  }

  const query = `
    INSERT INTO posts (category, content, imageUri, rating, review, timestamp, username)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [category, content, imageUri, rating, review, timestamp, username];
  
  try {
    await pool.query(query, values);
    console.log('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
    throw err;
  }
};

module.exports = {
  insertPostData,
  verifyConnection,
};
