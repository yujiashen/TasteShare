import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import profiles from '@assets/data/profiles';

const placeholderImage = 'https://example.com/default-profile.jpg';

const getProfileImage = (username: string) => {
  const profile = profiles.find(p => p.username === username);
  return profile ? profile.profileImage : placeholderImage;
};

const FollowerFollowingPopup = ({ visible, onClose, data, title }) => {
  const [followStates, setFollowStates] = useState(data.reduce((acc, username) => {
    acc[username] = false;
    return acc;
  }, {}));

  const handleFollowPress = (username) => {
    setFollowStates((prevStates) => ({
      ...prevStates,
      [username]: !prevStates[username],
    }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView>
            {data.map((username, index) => (
              <View key={index} style={styles.modalItem}>
                <Image source={{ uri: getProfileImage(username) }} style={styles.modalImage} />
                <Text style={styles.modalUsername}>{username}</Text>
                <TouchableOpacity
                  style={[styles.followButton, followStates[username] ? styles.unfollowButton : styles.followButton]}
                  onPress={() => handleFollowPress(username)}
                >
                  <Text style={styles.followButtonText}>{followStates[username] ? 'Unfollow' : 'Follow'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  modalUsername: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  followButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  unfollowButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: '#1da1f2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FollowerFollowingPopup;
