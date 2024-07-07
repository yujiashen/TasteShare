const express = require('express');
const bodyParser = require('body-parser');
const { connectToMongoDB, createPost, getFilteredPosts, getPostById, updatePost, deletePost } = require('./database/mongoDb');
const { connectToDatabase, getUserFollowing, createRelationship, updateRelationshipType } = require('./database/db');
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
    const posts = await getFilteredPosts();
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


app.get('/user/:username/followed_posts', async (req, res) => {
  try {
    // Step 1: Get the list of users the given username is following from PostgreSQL
    const following = await getUserFollowing(req.params.username);

    // Step 2: Fetch posts from MongoDB from the followed users (including the user's own posts)
    const followedUsernames = following.map(user => user.target_username).concat(req.params.username);
    const posts = await getFilteredPosts({ username: { $in: followedUsernames } });
    console.log('Filtered posts:', posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to create a relationship
app.post('/relationships', async (req, res) => {
  const { username, targetUsername, relationshipType } = req.body;

  try {
    const relationship = await createRelationship(username, targetUsername, relationshipType);
    res.status(201).json(relationship);
  } catch (error) {
    console.error('Error creating relationship:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to update relationship type
app.put('/relationships/:relationshipId/type', async (req, res) => {
  const { relationshipId } = req.params;
  const { relationshipType } = req.body;

  try {
    const updatedRelationship = await updateRelationshipType(relationshipId, relationshipType);
    res.status(200).json(updatedRelationship);
  } catch (error) {
    console.error('Error updating relationship type:', error);
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
