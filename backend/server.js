const express = require('express');
const dotenv = require('dotenv');
const { fetchPosterPath } = require('./api/tmdbApi');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint to fetch the poster path for a specific movie/show by its tconst
app.get('/api/poster/:tconst', async (req, res) => {
  const { tconst } = req.params;
  try {
    const posterPath = await fetchPosterPath(tconst);
    res.json({ posterPath });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poster path' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
