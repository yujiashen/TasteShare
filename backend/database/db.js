const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

async function connectToDatabase() {
  console.log('Connecting to database...');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('Database connection established');
      resolve({ db, connected: true });
    });
  });
}

async function setupDatabaseTable(database, tableName) {
  const createTableQuery = `
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${tableName} (
      tconst TEXT PRIMARY KEY,
      titleType TEXT,
      primaryTitle TEXT,
      originalTitle TEXT,
      startYear INTEGER,
      genres TEXT,
      numVotes INTEGER
    );
  `;

  return new Promise((resolve, reject) => {
    database.run(createTableQuery, [], function (err) {
      if (err) {
        console.error('Error setting up the database:', err);
        return reject(err);
      }
      console.log('Table created or already exists.');
      resolve();
    });
  });
}

async function loadDataIntoDatabase(database, tableName) {
  console.log('Loading data into', tableName);
  const data = require('../assets/data/movies_shows_top50k.json');

  const insertQuery = `
    INSERT OR REPLACE INTO ${tableName} (tconst, titleType, primaryTitle, originalTitle, startYear, genres, numVotes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    database.serialize(() => {
      try {
        const stmt = database.prepare(insertQuery);
        for (const item of data) {
          stmt.run([
            item.tconst,
            item.titleType,
            item.primaryTitle,
            item.originalTitle,
            item.startYear,
            item.genres,
            item.numVotes,
          ]);
        }
        stmt.finalize();

        database.get(`SELECT COUNT(*) AS count FROM ${tableName}`, [], (err, row) => {
          if (err) {
            console.error('Error counting rows:', err);
            return reject(err);
          }
          console.log('Table length:', row.count);
          resolve();
        });
      } catch (error) {
        console.error('Error loading data:', error);
        reject(error);
      }
    });
  });
}

async function searchMoviesInDatabase(database, query) {
  const selectQuery = `
    SELECT primaryTitle, startYear
    FROM movies_shows
    WHERE primaryTitle LIKE ?
    ORDER BY numVotes DESC
    LIMIT 10
  `;

  return new Promise((resolve, reject) => {
    database.all(selectQuery, [`%${query}%`], (err, rows) => {
      if (err) {
        console.error('Error searching movies in database:', err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  connectToDatabase,
  setupDatabaseTable,
  loadDataIntoDatabase,
  searchMoviesInDatabase
};
