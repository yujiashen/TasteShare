import { Stack } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { submitRef } from './add_like'; // adjust the import path as needed

export default function CreateStack() {
  return (
    <Stack>
      <Stack.Screen 
        name="add_like" 
        options={{ 
          title: 'Create',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                if (submitRef.current) {
                  submitRef.current();
                }
              }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
