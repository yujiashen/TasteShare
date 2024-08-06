import * as SQLite from 'expo-sqlite';


export async function connectToDatabase() {

  console.log('Connecting to database...');
  const database = await SQLite.openDatabaseAsync('database.db');

  console.log('Database connection established:', database.databaseName);
  const isConnected = Boolean(database.databaseName);
  return { db: database, connected: isConnected };
}

export async function setupDatabaseTable(database, tableName) {
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

  try {
    console.log('Creating table if not exists...');
    const result = await database.execAsync(createTableQuery, []);
    console.log('Table created or already exists. Query successful?');
  } catch (error) {
    console.error('Error setting up the database:', error);
    throw error;
  }
}

export async function loadDataIntoDatabase(database, tableName) {
  console.log('Looooaaaading',tableName);
  const tables = await database.getAllAsync("SELECT name FROM sqlite_master;");
  console.log('Tables in the database:', tables.map(table => table.name));
  const data = require('assets/data/movies_shows_top50k.json');

  const insertQuery = `
    INSERT OR REPLACE INTO ${tableName} (tconst, titleType, primaryTitle, originalTitle, startYear, genres, numVotes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;


  if (!database) {
    throw new Error('Database is not provided');
  }

  // await database.execAsync(`
  //   PRAGMA journal_mode = WAL;
  //   CREATE TABLE IF NOT EXISTS movies_shows (
  //     tconst TEXT PRIMARY KEY,
  //     titleType TEXT,
  //     primaryTitle TEXT,
  //     originalTitle TEXT,
  //     startYear INTEGER,
  //     genres TEXT,
  //     numVotes INTEGER
  //   );
  //   `);

  try {
    console.log('Inserting data into the database...');
    for (const item of data) {
      await database.runAsync(insertQuery, [
        item.tconst,
        item.titleType,
        item.primaryTitle,
        item.originalTitle,
        item.startYear,
        item.genres,
        item.numVotes,
      ]);
    }

    const countQuery = `SELECT COUNT(*) FROM ${tableName}`;
    const countResult = await database.getAllAsync(countQuery);
    console.log('Table length:', countResult[0]['COUNT(*)']);


  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}


export async function searchMoviesInDatabase(database, query) {
  const selectQuery = `
    SELECT tconst, primaryTitle, startYear
    FROM movies_shows
    WHERE primaryTitle LIKE ?
    ORDER BY numVotes DESC
    LIMIT 10
  `;

  try {
    //  console.log('About to query');
    const result = await database.getAllAsync(selectQuery, [`%${query}%`]);
    // console.log('Query result:',result);
    return result;
  } catch (error) {
    console.error('Error searching movies in database:', error);
    throw error;
  }
}
