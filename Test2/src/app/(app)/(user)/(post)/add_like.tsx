import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import StarRating from 'react-native-star-rating-widget';
import { launchImageLibrary } from 'react-native-image-picker';
import { connectToDatabase, searchMoviesInDatabase } from '@database/dbConnect';

export const submitRef = React.createRef<() => void>();

const AddLikeScreen = () => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [categories, setCategories] = useState([
    { label: 'Song', value: 'Song' },
    { label: 'Album', value: 'Album' },
    { label: 'Book', value: 'Book' },
    { label: 'Movie', value: 'Movie' },
    { label: 'Show', value: 'Show' },
  ]);
  const [contentItems, setContentItems] = useState([]);
  const [errors, setErrors] = useState({
    category: false,
    content: false,
    review: false,
    rating: false,
  });
  const [movieResults, setMovieResults] = useState([]);
  const [db, setDb] = useState<SQLite.WebSQLDatabase | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const { db: database, connected } = await connectToDatabase();
      if (connected) {
        setDb(database);
      }
    };

    initializeDatabase();
  }, []);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = () => {
    const newErrors = {
      category: !category,
      content: !content,
      review: !review,
      rating: rating === 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const newLike = {
      content,
      category,
      review,
      rating,
      imageUri,
      timestamp,
    };
    console.log(newLike);
    // Save the newLike object to your backend or state management solution

    // Clear the form and errors
    setContent('');
    setCategory('');
    setReview('');
    setRating(0);
    setImageUri(null);
    setErrors({
      category: false,
      content: false,
      review: false,
      rating: false,
    });
  };

  submitRef.current = handleSubmit;

  const fetchPosterPath = async (tconst) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tmdbApi/poster/${tconst}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.posterPath) {
        throw new Error('Poster path not found in response');
      }
      return `https://image.tmdb.org/t/p/w500${data.posterPath}`;
    } catch (error) {
      console.error('Error fetching poster path:', [error]);
      return null;
    }
  };

  const onContentChange = async (text: string) => {
    setContent(text);
    if ((category === 'Movie' || category === 'Show') && db) {
      try {
        const results = await searchMoviesInDatabase(db, text);
        setMovieResults(results.map(item => ({
          label: `${item.primaryTitle} (${item.startYear})`,
          value: item.tconst, // Store tconst for fetching poster
          yearStyle: styles.movieYear,
        })));
      } catch (error) {
        console.error('Error searching movies:', error);
      }
    }
    if (text) setErrors((prev) => ({ ...prev, content: false }));
  };

  const handleContentSelect = async (tconst) => {
    setContent(tconst);
    console.log('Handling Content Select: ', tconst);
    const posterPath = await fetchPosterPath(tconst);
    setImageUri(posterPath);
  };

  const closeDropdowns = () => {
    setCategoryOpen(false);
    setContentOpen(false);
    Keyboard.dismiss();
  };

  const renderForm = () => (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <View style={styles.formContainer}>
        <View style={[styles.row, { zIndex: 2000 }]}>
          <Text style={styles.label}>Category</Text>
          <DropDownPicker
            open={categoryOpen}
            value={category}
            items={categories}
            setOpen={(open) => {
              setCategoryOpen(open);
              if (open) {
                setContentOpen(false);
              }
            }}
            placeholder='Select a category'
            setValue={(callback) => {
              setCategory(callback());
              if (callback) {
                setErrors((prev) => ({ ...prev, category: false }));
                setContent('');
                setImageUri(null);
              }
            }}
            setItems={setCategories}
            style={[
              styles.dropdown,
              errors.category && styles.errorBorder,
            ]}
            containerStyle={styles.dropdownContainer}
            dropDownContainerStyle={[styles.dropdownList, { zIndex: 3000 }]} // Ensure dropdown is above other elements
            textStyle={styles.dropdownText}
          />
        </View>

        <TouchableWithoutFeedback onPress={closeDropdowns}>
          <View style={{ marginBottom: 16, zIndex: 1000 }}>
            <Text style={styles.label}>Content</Text>
            <DropDownPicker
              open={contentOpen}
              value={content}
              items={movieResults}
              setOpen={(open) => {
                setContentOpen(open);
                if (open) {
                  setCategoryOpen(false);
                }
              }}
              placeholder="What did you watch?"
              searchable={true}
              searchPlaceholder="What did you watch?"
              onChangeSearchText={onContentChange}
              setValue={(callback) => {
                console.log('Setting value');
                const value = callback();
                setContent(value);
                handleContentSelect(value);
                if (callback) setErrors((prev) => ({ ...prev, content: false }));
              }}
              style={[
                styles.dropdown,
                errors.content && styles.errorBorder,
              ]}
              containerStyle={[styles.dropdownContainer, { zIndex: 3000 }]}
              dropDownContainerStyle={[styles.dropdownList, { zIndex: 3000 }]} // Ensure dropdown is above other elements
              textStyle={styles.dropdownText}
              listMode="SCROLLVIEW"
              renderListItem={({ item }) => (
                <TouchableOpacity 
                style={styles.listItem} 
                onPress={() => {
                  handleContentSelect(item.value);
                  setContentOpen(false); // Close the dropdown after selecting an item
                }}
              >
                <Text numberOfLines={2} style={styles.listItemText}>
                  {item.label}
                </Text>
              </TouchableOpacity>
              )}
            />
          </View>
        </TouchableWithoutFeedback>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.posterImage} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleImagePick}>
            <Text style={styles.buttonText}>Pick an Image</Text>
          </TouchableOpacity>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Rating</Text>
          <View style={[styles.ratingContainer, errors.rating && styles.errorBorder]}>
            <StarRating
              rating={rating}
              onChange={(newRating) => {
                setRating(newRating);
                if (newRating > 0) setErrors((prev) => ({ ...prev, rating: false }));
              }}
              starSize={30}
              color={'gold'}
            />
          </View>
        </View>

        <Text style={styles.label}>Review</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.review && styles.errorBorder]}
          value={review}
          onChangeText={(text) => {
            if (text.length <= 5000) {
              setReview(text);
              if (text) setErrors((prev) => ({ ...prev, review: false }));
            }
          }}
          placeholder="Write your review"
          multiline
        />
        <Text style={styles.charCount}>{review.length}/5000</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={[{ key: 'form' }]}
      renderItem={() => (
        <TouchableWithoutFeedback onPress={closeDropdowns}>
          <ScrollView contentContainerStyle={styles.container}>
            {renderForm()}
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  formContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    color: '#999',
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownList: {
    backgroundColor: '#fafafa',
    zIndex: 1000,
  },
  dropdownText: {
    fontSize: 14,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  posterImage: {
    width: '100%',
    height: 300,
    marginTop: 16,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 5,
  },
  errorBorder: {
    borderColor: 'red',
    borderStyle: 'dotted',
  },
  link: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 12,
  },
});

export default AddLikeScreen;
