import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import profiles from '@assets/data/profiles';
import { useAuth } from '@/providers/AuthProvider';

const Login = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = () => {
    const userProfile = profiles.find(profile => profile.username === username);
    if (userProfile) {
      signIn(userProfile); // Set the user data in the AuthProvider
      router.push({ pathname: '/(user)/(feed)/index', params: { username } });
    } else {
      Alert.alert('Error', 'Username not found');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temporary Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1da1f2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;

// import db from '@database/dbConnect';
// import { setupDatabase, loadData } from '@database/dbSetup';

// const tableName = 'movies_shows';
// const dataFilePath = '@assets/data/movies_shows_top50k.json';

// (async () => {
//     await setupDatabase(db, tableName);
//     console.log('Set up',db);
//     await loadData(db, tableName, dataFilePath);
//     console.log('Loaded');
// })();