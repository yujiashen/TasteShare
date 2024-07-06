require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_URL = 'https://api.themoviedb.org/3/find';
const API_KEY = process.env.TMDB_API_KEY;
const AUTH_TOKEN = process.env.TMDB_AUTH_TOKEN;

const fetchPosterPath = async (tconst) => {
  const url = `${API_URL}/${tconst}?external_source=imdb_id`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    let posterPath = null;

    if (data.movie_results.length > 0) {
      posterPath = data.movie_results[0].poster_path;
    } else if (data.tv_results.length > 0) {
      posterPath = data.tv_results[0].poster_path;
    }

    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
  } catch (error) {
    console.error('Failed to fetch poster path:', error);
    throw error;
  }
};

module.exports = {
  fetchPosterPath
};
