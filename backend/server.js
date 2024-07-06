const express = require('express');
const dotenv = require('dotenv');
const { fetchPosterPath } = require('./api/tmdbApi');
const { insertPostData, verifyConnection } = require('./database/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/tmdbApi/poster/:tconst', async (req, res) => {
  const { tconst } = req.params;
  try {
    const posterPath = await fetchPosterPath(tconst);
    res.json({ posterPath });
  } catch (error) {
    console.error('Error fetching poster path:', error);
    res.status(500).json({ error: 'Failed to fetch poster path' });
  }
});

app.post('/submit_post', async (req, res) => {
  try {
    await insertPostData(req.body);
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Verify connection and list tables on server start
verifyConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to verify database connection:', err);
});

