import { Stack } from 'expo-router';

export default function ProfileStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" options={{ title: 'Profile' }} />
      <Stack.Screen name="seeAll" options={{ title: 'All' }} />
    </Stack>
  );
}

