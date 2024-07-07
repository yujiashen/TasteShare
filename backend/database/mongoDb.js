const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Define the post schema
const postSchema = new mongoose.Schema({
  postId: { type: String, default: uuidv4, unique: true },
  category: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  imageUri: String,
  username: String,
  review: String,
  rating: Number,
  contentYear: Number,
  likes: [String],
  comments: [{
    username: String,
    text: String,
    timestamp: { type: Date, default: Date.now },
  }]
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

// Function to create a new post
const createPost = async (postData) => {
  try {
    console.log('In createPost',postData);
    const newPost = new Post(postData);
    await newPost.save();
    console.log('Post created:', newPost);
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Function to get posts based on filter criteria
const getFilteredPosts = async (filter = {}) => {
  try {
    const posts = await Post.find(filter);
    console.log('Filtered posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// Function to get a post by ID
const getPostById = async (postId) => {
  try {
    const post = await Post.findOne({ postId });
    console.log('Post by ID:', post);
    return post;
  } catch (error) {
    console.error('Error getting post by ID:', error);
    throw error;
  }
};

// Function to update a post
const updatePost = async (postId, updateData) => {
  try {
    const updatedPost = await Post.findOneAndUpdate({ postId }, updateData, { new: true });
    console.log('Updated post:', updatedPost);
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Function to delete a post
const deletePost = async (postId) => {
  try {
    await Post.findOneAndDelete({ postId });
    console.log('Post deleted:', postId);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

module.exports = {
  connectToMongoDB,
  createPost,
  getFilteredPosts,
  getPostById,
  updatePost,
  deletePost,
};
