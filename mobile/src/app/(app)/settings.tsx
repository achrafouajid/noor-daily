import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { AlarmManager } from '@/components/AlarmManager';
import { CustomAlarm } from '@/types';

import { getItem, setItem } from '@/lib/storage';

const getSavedAlarms = (): CustomAlarm[] => {
  return getItem<CustomAlarm[]>('customAlarms') || [];
};

const saveAlarms = (alarms: CustomAlarm[]) => {
  setItem('customAlarms', alarms);
};

export default function SettingsScreen() {
  const [alarms, setAlarms] = useState<CustomAlarm[]>([]);

  useEffect(() => {
    setAlarms(getSavedAlarms());
  }, []);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const REQUIRED_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="bg-white pt-16 pb-4 px-6 border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-800">Planner</Text>
        <Text className="text-slate-500 text-sm">Manage notifications & reminders</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <AlarmManager
          alarms={alarms}
          setAlarms={setAlarms}
          prayerNames={REQUIRED_PRAYERS}
        />
      </ScrollView>
    </View>
  );
}
