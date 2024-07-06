const express = require('express');
const dotenv = require('dotenv');
const { fetchPosterPath } = require('./api/tmdbApi');
const { connectToDatabase, setupDatabaseTable, loadDataIntoDatabase, searchMoviesInDatabase } = require('./database/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/poster/:tconst', async (req, res) => {
  const { tconst } = req.params;
  try {
    const posterPath = await fetchPosterPath(tconst);
    res.json({ posterPath });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poster path' });
  }
});

app.get('/api/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    const { db } = await connectToDatabase();
    const results = await searchMoviesInDatabase(db, query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  const { db } = await connectToDatabase();
  await setupDatabaseTable(db, 'movies_shows');
  await loadDataIntoDatabase(db, 'movies_shows');
  console.log('Database setup complete');
});
