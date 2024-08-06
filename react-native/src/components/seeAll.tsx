import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import defaultImages from '@assets/images/defaultImages';

DropDownPicker.setListMode("SCROLLVIEW");

const renderStars = (rating) => {
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

const SeeAll = () => {
  const params = useLocalSearchParams();
  const likes = JSON.parse(params.likes);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStars, setSelectedStars] = useState(0);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('title_asc');

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Movie', value: 'movie' },
    { label: 'Album', value: 'album' },
    { label: 'Book', value: 'book' },
    { label: 'Show', value: 'show' },
    { label: 'Song', value: 'song' },
  ];

  const stars = [
    { label: 'All Ratings', value: 0 },
    { label: '1 Star', value: 1 },
    { label: '2 Stars', value: 2 },
    { label: '3 Stars', value: 3 },
    { label: '4 Stars', value: 4 },
    { label: '5 Stars', value: 5 },
  ];

  const sortlikes = (likes) => {
    switch (sortOrder) {
      case 'title_asc':
        return [...likes].sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return [...likes].sort((a, b) => b.title.localeCompare(a.title));
      case 'rating_asc':
        return [...likes].sort((a, b) => a.rating - b.rating);
      case 'rating_desc':
        return [...likes].sort((a, b) => b.rating - a.rating);
      case 'time_asc':
        return [...likes].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      case 'time_desc':
        return [...likes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      default:
        return likes;
    }
  };

  const filteredlikes = sortlikes(likes.filter((item) => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const starsMatch = selectedStars === 0 || item.rating === selectedStars;
    return categoryMatch && starsMatch;
  }));

  const renderItem = ({ item }) => {
    const defaultImage = defaultImages[item.category];
    const imageUri = item.coverImage ? item.coverImage : defaultImage;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.itemImage} />
          <View style={styles.starOverlay}>{renderStars(item.rating)}</View>
        </View>
        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
      </View>
    );
  };

  const openSortModal = () => {
    setSortModalVisible(true);
  };

  const closeSortModal = () => {
    setSortModalVisible(false);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    closeSortModal();
  };

  const closeDropdowns = () => {
    setCategoryOpen(false);
    setStarOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <View style={styles.container}>
        <View style={styles.filterBar}>
          <DropDownPicker
            open={categoryOpen}
            value={selectedCategory}
            items={categories}
            setOpen={setCategoryOpen}
            setValue={setSelectedCategory}
            placeholder="Select Category"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            dropDownContainerStyle={styles.dropdownList}
            textStyle={styles.dropdownText}
          />
          <DropDownPicker
            open={starOpen}
            value={selectedStars}
            items={stars}
            setOpen={setStarOpen}
            setValue={setSelectedStars}
            placeholder="Select Rating"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            dropDownContainerStyle={styles.dropdownList}
            textStyle={styles.dropdownText}
          />
          <TouchableOpacity style={styles.sortButton} onPress={openSortModal}>
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredlikes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
        />
        <Modal
          visible={sortModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeSortModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => handleSortChange('title_asc')} style={styles.modalItem}>
                <Text>Title (A-Z)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortChange('title_desc')} style={styles.modalItem}>
                <Text>Title (Z-A)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortChange('rating_asc')} style={styles.modalItem}>
                <Text>Rating (Low to High)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortChange('rating_desc')} style={styles.modalItem}>
                <Text>Rating (High to Low)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortChange('time_asc')} style={styles.modalItem}>
                <Text>Time (Oldest to Newest)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortChange('time_desc')} style={styles.modalItem}>
                <Text>Time (Newest to Oldest)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeSortModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SeeAll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 1000,
  },
  dropdownContainer: {
    width: '40%',
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownList: {
    backgroundColor: '#fafafa',
    zIndex: 1000,
  },
  dropdownText: {
    fontSize: 14, // Adjust this value to make the text smaller
  },
  sortButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  starOverlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
  },
  starContainer: {
    flexDirection: 'row',
  },
  itemTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  flatListContent: {
    paddingTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginBottom: 20,
  },
  modalItem: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
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
