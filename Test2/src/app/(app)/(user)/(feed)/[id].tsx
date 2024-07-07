import React, { useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PostListItem from '@/components/PostListItem';
import { useAuth } from '@/providers/AuthProvider';
import { usePosts, PostsProvider } from '@/providers/PostsProvider';

const UserFeedScreen = () => {
  const { username } = useLocalSearchParams();
  const { user: authUser } = useAuth(); 
  const { posts, fetchPosts } = usePosts();

  useEffect(() => {
    fetchPosts(username);
  }, [username]);

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

export default () => (
  <PostsProvider>
    <UserFeedScreen />
  </PostsProvider>
);
