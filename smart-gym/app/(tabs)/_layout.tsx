import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // primary blue
        tabBarInactiveTintColor: '#9da6b9',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111621' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#1c2333' : '#e2e8f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <MaterialIcons name="fitness-center" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Log',
          tabBarIcon: ({ color }) => (
            <View style={{
              marginTop: -20,
              backgroundColor: '#2563eb',
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 4,
              borderColor: colorScheme === 'dark' ? '#111621' : '#ffffff',
            }}>
              <MaterialIcons name="history" size={28} color="white" />
            </View>
          ),
          tabBarLabel: 'History',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} />,
        }}
      />
      {/* If any other tab screens exist inside (tabs), they would need options or be hidden. */}
    </Tabs>
  );
}
