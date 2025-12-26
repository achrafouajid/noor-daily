/* eslint-disable react/no-unstable-nested-components */
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Clock, List, Settings } from 'lucide-react-native';
import colors from '@/components/ui/colors';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const activeColor = '#059669'; // Emerald 600
  const inactiveColor = '#94a3b8'; // Slate 400

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff',
          height: 80,
          paddingTop: 10,
          paddingBottom: 25, // For safe area
        },
        tabBarLabelStyle: {
          fontWeight: '500',
          fontSize: 10,
          marginTop: 2
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Prayers',
          tabBarIcon: ({ color, focused }) => <Clock size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
          tabBarLabel: 'Prayers',
        }}
      />

      <Tabs.Screen
        name="adhkar"
        options={{
          title: 'Adhkar',
          tabBarIcon: ({ color, focused }) => <List size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
          tabBarLabel: 'Adhkar',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color, focused }) => <Settings size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
          tabBarLabel: 'Planner',
        }}
      />
    </Tabs>
  );
}
