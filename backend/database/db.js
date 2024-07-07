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

// Function to verify or create a user in PostgreSQL
const verifyOrCreateUser = async (username, email) => {
  try {
    const res = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (res.rows.length === 0) {
      // User does not exist, create a new user
      await pool.query(
        'INSERT INTO users (username, email) VALUES ($1, $2)',
        [username, email]
      );
      console.log('New user created');
    } else {
      console.log('User already exists');
    }
  } catch (err) {
    console.error('Error verifying or creating user:', err);
    throw err;
  }
};

// Function to follow a user
const followUser = async (followerId, followeeId) => {
  try {
    const profilePublicResult = await pool.query(
      'SELECT profile_public FROM users WHERE id = $1',
      [followeeId]
    );
    const profilePublic = profilePublicResult.rows[0].profile_public;

    const status = profilePublic ? 'following' : 'requested';
    
    await pool.query(
      'INSERT INTO relationships (user_id, target_user_id, status) VALUES ($1, $2, $3) ON CONFLICT (user_id, target_user_id) DO UPDATE SET status = $3',
      [followerId, followeeId, status]
    );
    console.log(`User ${followerId} is now ${status} user ${followeeId}`);
  } catch (err) {
    console.error('Error following user:', err);
    throw err;
  }
};

// Function to accept a follow request
const acceptFollowRequest = async (userId, followerId) => {
  try {
    await pool.query(
      'UPDATE relationships SET status = $1 WHERE user_id = $2 AND target_user_id = $3 AND status = $4',
      ['following', followerId, userId, 'requested']
    );
    console.log(`User ${userId} accepted follow request from user ${followerId}`);
  } catch (err) {
    console.error('Error accepting follow request:', err);
    throw err;
  }
};

// Function to block a user
const blockUser = async (userId, targetUserId) => {
  try {
    await pool.query(
      'INSERT INTO relationships (user_id, target_user_id, status) VALUES ($1, $2, $3) ON CONFLICT (user_id, target_user_id) DO UPDATE SET status = $3',
      [userId, targetUserId, 'blocked']
    );
    console.log(`User ${userId} blocked user ${targetUserId}`);
  } catch (err) {
    console.error('Error blocking user:', err);
    throw err;
  }
};

const getUserFollowing = async (username) => {
  try {
    const result = await pool.query('SELECT target_username FROM relationships WHERE username = $1 AND relationship_type = $2', [username, 'follow']);
    return result.rows;
  } catch (err) {
    console.error('Error getting user following:', err);
    throw err;
  }
};


const createRelationship = async (username, targetUsername, relationshipType) => {
  try {
    const result = await pool.query(`
      INSERT INTO relationships (username, target_username, relationship_type)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [username, targetUsername, relationshipType]);
    return result.rows[0];
  } catch (err) {
    console.error('Error creating relationship:', err);
    throw err;
  }
};

const updateRelationshipType = async (relationshipId, relationshipType) => {
  try {
    const result = await pool.query(`
      UPDATE relationships
      SET relationship_type = $1
      WHERE id = $2
      RETURNING *
    `, [relationshipType, relationshipId]);
    return result.rows[0];
  } catch (err) {
    console.error('Error updating relationship type:', err);
    throw err;
  }
};

module.exports = {
  connectToDatabase,
  verifyConnection,
  verifyOrCreateUser,
  followUser,
  acceptFollowRequest,
  blockUser,
  getUserFollowing,
  createRelationship,
  updateRelationshipType,
};
