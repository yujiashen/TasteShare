import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter} from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import profiles from '@assets/data/profiles';

type UserProfile = {
  username: string;
  profileImage: string;
  followers: string[];
  following: string[];
  likes: Like[];
};

type ProfilePageProps = {
  userProfile: UserProfile;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
};

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
                  style={[styles.followButton, followStates[username] ? styles.unrequestButton : styles.followButton]}
                  onPress={() => handleFollowPress(username)}
                >
                  <Text style={styles.followButtonText}>{followStates[username] ? 'Requested' : 'Follow'}</Text>
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

const MoreOptionsPopup = ({ visible, onClose }) => (
  <Modal visible={visible} transparent >
    <TouchableOpacity style={styles.moreOptionsOverlay} onPress={onClose}>
      <View style={styles.moreOptionsContainer}>
        <TouchableOpacity style={styles.moreOptionsItem}>
          <Text style={styles.moreOptionsText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreOptionsItem}>
          <Text style={styles.moreOptionsText}>Block</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreOptionsItem}>
          <Text style={styles.moreOptionsText}>Report</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onFollowersPress, onFollowingPress }) => {
  const [Requested, setRequested] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [popupTitle, setPopupTitle] = useState('');

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User profile data is not available.</Text>
      </View>
    );
  }

  const handleFollowPress = () => {
    setRequested(!Requested);    
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleMoreOptionsPress = () => {
    setMoreOptionsVisible(true);
  };

  const closeMoreOptionsPopup = () => {
    setMoreOptionsVisible(false);
  };

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userProfile.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userProfile.username}</Text>
        <View style={styles.followSection}>
          <Text style={styles.followText}>{userProfile.followers.length} Followers</Text>
          <Text style={styles.followText}>{userProfile.following.length} Following</Text>
        </View>
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.followButton, Requested ? styles.unrequestButton : styles.followButton]}
            onPress={handleFollowPress}
          >
            <Text style={styles.followButtonText}>{Requested ? 'Requested' : 'Follow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton} onPress={handleMoreOptionsPress}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <FollowerFollowingPopup 
        visible={popupVisible} 
        onClose={closePopup} 
        data={popupData} 
        title={popupTitle} 
      />
      
      <MoreOptionsPopup 
        visible={moreOptionsVisible}
        onClose={closeMoreOptionsPopup}
      />
    </ScrollView>
  );
};

export default function ProfileScreen() {
  const username  = useLocalSearchParams();
  const userProfile = profiles.find(profile => profile.username === username.id);
  
  return (
    <SafeAreaView style={styles.container}>
      <ProfilePage
        userProfile={userProfile}
        onFollowersPress={() => {}}
        onFollowingPress={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  followSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 10,
  },
  followText: {
    fontSize: 16,
    color: '#666',
  },
  buttonSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  unrequestButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  moreButton: {
    padding: 6,
  },
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
  modalFollowButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  modalFollowButtonText: {
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
  moreOptionsOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  moreOptionsContainer: {
    width: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 200,
  },
  moreOptionsItem: {
    padding: 5,
  },
  moreOptionsText: {
    fontSize: 14,
  },
});
