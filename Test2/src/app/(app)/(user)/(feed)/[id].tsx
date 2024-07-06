import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import profiles from '@assets/data/profiles';
import posts from '@assets/data/posts';
import PostListItem from '@/components/PostListItem';
import { useAuth } from '@/providers/AuthProvider';

const UserFeedScreen = () => {
  const { username } = useLocalSearchParams();
  const { user: authUser } = useAuth(); 
  const user = profiles.find(profile => profile.username === username);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }
  const followingUsernames = user.following;

  // Filter posts to include only those created by followed users
  const userPosts = posts.filter(post => followingUsernames.includes(post.username));

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.welcomeText}>Welcome, {authUser?.name || authUser.username}!</Text>
    </View>
  );

  return (
    <FlatList
      data={userPosts}
      renderItem={({ item }) => <PostListItem post={item} />}
      keyExtractor={item => item.id}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      ListHeaderComponent={renderHeader} // Add the header component here
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
