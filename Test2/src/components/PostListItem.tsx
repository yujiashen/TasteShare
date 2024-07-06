import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { Post } from '../types';
import { Link, useSegments, useRouter } from 'expo-router';
import LikeButton from '@/components/Buttons/LikeButton';
import CommentButton from '@/components/Buttons/CommentButton';
import ShareButton from '@/components/Buttons/ShareButton';
import BookmarkButton from '@/components/Buttons/BookmarkButton';
import CommentsModal from '@/components/Modals/CommentsModal';
import PostOptionsModal from '@/components/Modals/PostOptionsModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type PostListItemProps = {
  post: Post;
};

const PostListItem = ({ post }: PostListItemProps) => {
  const segments = useSegments();
  const router = useRouter();
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);

  const handleShare = () => {
    console.log('Sharing');
  };

  const handleComment = () => {
    setCommentsModalVisible(true);
  };

  const handleProfilePress = () => {
    console.log('Opening profile', post.username);
    router.push(`/(user)/(profile)/(profile_viewable)/${post.username}`);
  };

  const handleOptionsPress = () => {
    setOptionsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleProfilePress} style={styles.profileContainer}>
          <Image
            source={{ uri: post.userProfileImage || defaultPizzaImage }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{post.username}</Text>
        </Pressable>
        <TouchableOpacity onPress={handleOptionsPress} style={styles.optionsButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Link href={`/${segments[0]}/feed/${post.id}`} asChild>
        <Pressable>
          <Image
            source={{ uri: post.image || defaultPizzaImage }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>
      </Link>

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <LikeButton />
          <CommentButton onPress={handleComment} />
          <ShareButton onPress={handleShare} />
        </View>
        <BookmarkButton />
      </View>

      <Text style={styles.likes}>{post.likes.length || 0} likes</Text>
      <Text style={styles.description}>{post.description}</Text>

      <Pressable onPress={handleComment}>
        <View>
          {post.comments.length > 2 ? (
            <Text style={styles.viewComments}>
              View all {post.comments.length} comments
            </Text>
          ) : null}
          {post.comments.slice(0, 2).map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text style={styles.commentText}> {comment.text}</Text>
            </View>
          ))}
        </View>
      </Pressable>

      <CommentsModal
        visible={isCommentsModalVisible}
        onClose={() => setCommentsModalVisible(false)}
        comments={post.comments.map(comment => ({
          id: comment.id,
          user: comment.username,
          comment: comment.text,
          userProfileImage: comment.userProfileImage || defaultPizzaImage,
        }))}
        username={post.username}
        description={post.description}
      />

      <PostOptionsModal
        visible={isOptionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
      />
    </View>
  );
};

export default PostListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionsButton: {
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  likes: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    marginVertical: 5,
  },
  viewComments: {
    color: 'grey',
    marginVertical: 5,
  },
  comment: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  commentUsername: {
    fontWeight: 'bold',
  },
  commentText: {
    color: 'grey',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginHorizontal: 5,
    fontSize: 24,
  },
});