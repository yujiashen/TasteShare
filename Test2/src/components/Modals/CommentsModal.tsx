import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CommentLikeButton from '@/components/Buttons/CommentLikeButton';

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  comments: { id: string; user: string; comment: string; userProfileImage: string }[];
  username: string;
  description: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ visible, onClose, comments, username, description }) => {
  const [comment, setComment] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleProfilePress = (username) => {
    console.log('Opening profile', username);
    router.push(`/(user)/(profile)/(profile_viewable)/${username}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <TouchableOpacity onPress={() => handleProfilePress(item.user)}>
        <Image source={{ uri: item.userProfileImage }} style={styles.commentProfileImage} />
      </TouchableOpacity>
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentUsername}>{item.user}</Text>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>
      <CommentLikeButton />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[
            styles.modalContent,
            { height: isKeyboardVisible ? '100%' : '60%' },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => (
              <View style={styles.reviewContainer}>
                <Text style={styles.reviewTitle}>{username}</Text>
                <Text style={styles.reviewText}>{description}</Text>
              </View>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            onFocus={() => setKeyboardVisible(true)}
            onBlur={() => setKeyboardVisible(false)}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add overlay effect
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  reviewContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  reviewTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
    color: '#333',
  },
  reviewText: {
    color: 'grey',
    fontSize: 14,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginRight: 20,
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    color: 'grey',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    height: 40,
    paddingHorizontal: 20,
  },
});

export default CommentsModal;
