import { Stack } from 'expo-router';
import { Button } from 'react-native';
import { submitRef } from './add_like'; // adjust the import path as needed

export default function CreateStack() {
  return (
    <Stack>
      <Stack.Screen 
        name="add_like" 
        options={{ 
          title: 'Create',
          headerRight: () => (
            <Button
              onPress={() => {
                if (submitRef.current) {
                  submitRef.current();
                }
              }}
              title="Submit"
              color="#000"
            />
          ),
        }} 
      />
    </Stack>
  );
}
