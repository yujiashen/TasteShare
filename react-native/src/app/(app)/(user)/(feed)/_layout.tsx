// import {Colors} from '@/constants/Colors';
import { Stack } from 'expo-router';


export default function FeedStack() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Feed' }} />
    </Stack>
  );
}

