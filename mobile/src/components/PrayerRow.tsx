import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';

interface PrayerRowProps {
    name: string;
    time: string;
    isActive: boolean;
}

export const PrayerRow: React.FC<PrayerRowProps> = ({ name, time, isActive }) => {
    return (
        <View
            className={`flex-row justify-between items-center p-5 border-b border-neutral-100 last:border-none ${isActive ? 'bg-emerald-50' : ''}`}
        >
            <View className="flex-row items-center space-x-4 gap-4">
                <View className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                <Text className={`font-medium ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {name}
                </Text>
            </View>
            <Text className={`font-mono ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                {time}
            </Text>
        </View>
    );
};
