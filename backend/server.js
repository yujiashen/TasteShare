const express = require('express');
const bodyParser = require('body-parser');
const { connectToMongoDB, createPost, getAllPosts, getPostById, updatePost, deletePost } = require('./database/mongoDb');
const { connectToDatabase, searchMoviesInDatabase } = require('./database/db');
const { fetchPosterPath } = require('./api/tmdbApi');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// API endpoint to get the poster path using tmdbApi
app.get('/poster/:tconst', async (req, res) => {
  try {
    const posterPath = await fetchPosterPath(req.params.tconst);
    res.json({ posterPath });
  } catch (error) {
    console.error('Error fetching poster path:', error);
    res.status(500).json({ error: 'Failed to fetch poster path' });
  }
});

// MongoDB routes
app.post('/submit_post', async (req, res) => {
  try {
    const newPost = await createPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/posts/:postId', async (req, res) => {
  try {
    const post = await getPostById(req.params.postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/posts/:postId', async (req, res) => {
  try {
    const updatedPost = await updatePost(req.params.postId, req.body);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/posts/:postId', async (req, res) => {
  try {
    await deletePost(req.params.postId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to both MongoDB and PostgreSQL
connectToMongoDB().then(() => {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});
