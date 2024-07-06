import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.background,
        tabBarInactiveTintColor: 'gainsboro',
        tabBarStyle: {
          backgroundColor: Colors.light.tint,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="(profile)/(profile_viewable)" options={{ href: null,  headerShown: false }} />
      <Tabs.Screen name="(profile)/(profile_private)" options={{ href: null,  headerShown: false }} />
      <Tabs.Screen
        name="(feed)"
        options={{
          title: 'Feed',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(post)"
        options={{
          title: 'Post',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)/(profile_self)"
        options={{
          title: 'My Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
