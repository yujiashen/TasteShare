import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PostListItem from '@/components/PostListItem';
import { useAuth } from '@/providers/AuthProvider';

const UserFeedScreen = () => {
  console.log('Rendering UserFeedScreen');
  const { username, timestamp } = useLocalSearchParams();
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('In useEffect', username, timestamp);
    const fetchPosts = async () => {
      try {
        console.log('in fetch posts try')
        const response = await fetch(`http://localhost:3000/user/${username}/followed_posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, [username, timestamp]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No posts found</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.welcomeText}>Welcome, {authUser?.name || authUser.username}!</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostListItem post={item} />}
      keyExtractor={item => item.postId}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      ListHeaderComponent={renderHeader}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  headerContainer: {
    marginBottom: 10,
    padding: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default UserFeedScreen;
