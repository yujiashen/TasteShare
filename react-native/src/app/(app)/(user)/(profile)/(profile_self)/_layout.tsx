import { Stack } from 'expo-router';

export default function ProfileStack() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'My Profile' }} />
      <Stack.Screen name="seeAll" options={{ title: 'All' }} />
    </Stack>
  );
}

