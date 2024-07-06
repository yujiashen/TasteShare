const dotenv = require('dotenv');
const { fetchPosterPath } = require('./api/tmdbApi');

// Load environment variables from .env file
dotenv.config();

const testFetchPosterPath = async (tconst) => {
  try {
    const posterPath = await fetchPosterPath(tconst);
    console.log(`Poster path for ${tconst}:`, posterPath);
  } catch (error) {
    console.error('Error fetching poster path:', error);
  }
};

// Replace with a valid tconst value to test
const tconst = 'tt13585362';

testFetchPosterPath(tconst);
