import React from 'react';
import { View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { AdhkarCard } from '@/components/AdhkarCard';
import { ADHKAR_DATA } from '@/lib/constants';

export default function AdhkarScreen() {
    return (
        <View className="flex-1 bg-slate-50">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="bg-white pt-16 pb-4 px-6 border-b border-slate-100">
                <Text className="text-2xl font-bold text-slate-800">Daily Adhkar</Text>
                <Text className="text-slate-500 text-sm">Reminders for the soul</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
                {ADHKAR_DATA.map(item => (
                    <AdhkarCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}
