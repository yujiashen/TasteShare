import React, { createContext, useContext, useState } from 'react';

const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async (username) => {
    try {
      const response = await fetch(`http://localhost:3000/user/${username}/followed_posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <PostsContext.Provider value={{ posts, setPosts, fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
};
