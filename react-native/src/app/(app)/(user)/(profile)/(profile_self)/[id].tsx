import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter} from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfilePageProps, UserProfile ,Category, Like} from '@/types';
import profiles from '@assets/data/profiles';
import defaultImages from '@assets/images/defaultImages';
import MoreProfileOptionsPopup from '@/components/Modals/MoreProfileOptions';
import FollowerFollowingPopup from '@/components/Modals/FollowerFollowingPopup';
import { useAuth } from '@/providers/AuthProvider';

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <MaterialCommunityIcons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color="gold"
      />
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};


const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onFollowersPress, onFollowingPress }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [moreOptionsVisible, setMoreProfileOptionsVisible] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [popupTitle, setPopupTitle] = useState('');


  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User profile data is not available.</Text>
      </View>
    );
  }

  const recentlyWatched = userProfile.likes.filter(
    (item) => item.category === 'movie' || item.category === 'show'
  );

  const recentlyListened = userProfile.likes.filter(
    (item) => item.category === 'album' || item.category === 'song'
  );

  const recentlyRead = userProfile.likes.filter(
    (item) => item.category === 'book'
  );

  const renderCategoryItem = (item: Like) => {
    const [imageError, setImageError] = useState(false);
    const defaultImage = defaultImages[item.category];
    const imageUri = item.coverImage && !imageError ? item.coverImage : defaultImage;

    return (
      <View key={item.id} style={styles.categoryItem}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.categoryImage}
            onError={() => {
              setImageError(true);
            }}
          />
          <View style={styles.starOverlay}>{renderStars(item.rating)}</View>
        </View>
        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
      </View>
    );
  };


  const handleFollowersPress = () => {
    setPopupData(userProfile.followers);
    setPopupTitle('Followers');
    setPopupVisible(true);
  };

  const handleFollowingPress = () => {
    setPopupData(userProfile.following);
    setPopupTitle('Following');
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleMoreProfileOptionsPress = () => {
    setMoreProfileOptionsVisible(true);
  };

  const closeMoreProfileOptionsPopup = () => {
    setMoreProfileOptionsVisible(false);
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
          <TouchableOpacity onPress={handleFollowersPress}>
            <Text style={styles.followText}>{userProfile.followers.length} Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFollowingPress}>
            <Text style={styles.followText}>{userProfile.following.length} Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categorySection}>
      <TouchableOpacity 
        style={styles.seeAllButton}
        onPress={() => router.push({
          pathname: '/(user)/(profile)/(profile_viewable)/seeAll',
          params: { likes: JSON.stringify(userProfile.likes) }
        })}
      >
        <Text style={styles.seeAllText}>See all</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
      </TouchableOpacity>
        <Text style={styles.categoryTitle}>Recently Watched</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyWatched.map(renderCategoryItem)}
        </ScrollView>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Recently Listened</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyListened.map(renderCategoryItem)}
        </ScrollView>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Recently Read</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyRead.map(renderCategoryItem)}
        </ScrollView>
      </View>

      <FollowerFollowingPopup 
        visible={popupVisible} 
        onClose={closePopup} 
        data={popupData} 
        title={popupTitle} 
      />
      
      <MoreProfileOptionsPopup 
        visible={moreOptionsVisible}
        onClose={closeMoreProfileOptionsPopup}
      />
    </ScrollView>
  );
};

export default function ProfileScreen() {
  const { user: authUser } = useAuth(); 
  const userProfile = profiles.find(profile => profile.username === authUser.username);

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
  unfollowButton: {
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
  categorySection: {
    marginBottom: 20,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#1da1f2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100, // Ensure square cropping
  },
  categoryImage: {
    width: '100%',
    height: '100%', // Ensure square cropping
    borderRadius: 10,
  },
  categoryItem: {
    marginRight: 10,
    alignItems: 'center',
    width: 100, // Ensure alignment
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  starOverlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
  },
  itemTitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
  fallbackContainer: {
    width: 100,
    height: 100, // Square cropping
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
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
