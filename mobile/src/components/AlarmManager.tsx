import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { Text } from '@/components/ui/text';
import { CustomAlarm, PrayerTimes } from '../types';
import { Plus, Trash2, Bell, Clock } from 'lucide-react-native';

interface AlarmManagerProps {
    alarms: CustomAlarm[];
    setAlarms: React.Dispatch<React.SetStateAction<CustomAlarm[]>>;
    prayerNames: string[];
}

export const AlarmManager: React.FC<AlarmManagerProps> = ({ alarms, setAlarms, prayerNames }) => {
    const [newAlarm, setNewAlarm] = useState<Partial<CustomAlarm>>({
        prayerName: 'Fajr',
        offsetMinutes: -10,
        message: '',
        enabled: true
    });

    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        if (!newAlarm.message) return;

        const alarm: CustomAlarm = {
            id: Date.now().toString(),
            prayerName: newAlarm.prayerName as keyof PrayerTimes,
            offsetMinutes: newAlarm.offsetMinutes || 0,
            message: newAlarm.message,
            enabled: true
        };

        setAlarms([...alarms, alarm]);
        setIsAdding(false);
        setNewAlarm({ ...newAlarm, message: '' });
    };

    const deleteAlarm = (id: string) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    const toggleAlarm = (id: string) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    };

    return (
        <View className="space-y-6 gap-6">
            <View className="flex-row justify-between items-center">
                <Text className="font-bold text-slate-800 text-lg">Custom Reminders</Text>
                <TouchableOpacity
                    onPress={() => setIsAdding(!isAdding)}
                    className="flex-row items-center space-x-2 gap-2 bg-emerald-600 px-4 py-2 rounded-full"
                >
                    {!isAdding && <Plus size={16} color="white" />}
                    <Text className="text-white font-medium text-sm">{isAdding ? 'Cancel' : 'Add New'}</Text>
                </TouchableOpacity>
            </View>

            {isAdding && (
                <View className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 space-y-4 gap-4">
                    <View>
                        <Text className="text-xs font-semibold text-slate-500 uppercase mb-1">Message</Text>
                        <TextInput
                            placeholder="e.g. Read Surah Mulk"
                            className="w-full p-3 bg-slate-50 rounded-lg text-slate-800"
                            value={newAlarm.message}
                            onChangeText={(text) => setNewAlarm({ ...newAlarm, message: text })}
                        />
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-xs font-semibold text-slate-500 uppercase mb-1">Timing</Text>
                            <View className="flex-row items-center space-x-2 gap-2">
                                <TextInput
                                    keyboardType="numeric"
                                    className="flex-1 p-3 bg-slate-50 rounded-lg text-slate-800"
                                    value={Math.abs(newAlarm.offsetMinutes || 0).toString()}
                                    onChangeText={(text) => {
                                        const val = parseInt(text) || 0;
                                        const sign = (newAlarm.offsetMinutes || 0) < 0 ? -1 : 1;
                                        setNewAlarm({ ...newAlarm, offsetMinutes: val * sign });
                                    }}
                                />
                                <Text className="text-slate-500 text-sm">min</Text>
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-semibold text-slate-500 uppercase mb-1">Relative To</Text>
                            <View className="flex-row bg-slate-50 rounded-lg p-1">
                                <TouchableOpacity
                                    onPress={() => setNewAlarm({ ...newAlarm, offsetMinutes: -Math.abs(newAlarm.offsetMinutes || 0) })}
                                    className={`flex-1 py-3 items-center rounded-md ${(newAlarm.offsetMinutes || 0) < 0 ? 'bg-emerald-100' : ''}`}
                                >
                                    <Text className={`text-xs font-medium ${(newAlarm.offsetMinutes || 0) < 0 ? 'text-emerald-700' : 'text-slate-500'}`}>Before</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setNewAlarm({ ...newAlarm, offsetMinutes: Math.abs(newAlarm.offsetMinutes || 0) })}
                                    className={`flex-1 py-3 items-center rounded-md ${(newAlarm.offsetMinutes || 0) >= 0 ? 'bg-emerald-100' : ''}`}
                                >
                                    <Text className={`text-xs font-medium ${(newAlarm.offsetMinutes || 0) >= 0 ? 'text-emerald-700' : 'text-slate-500'}`}>After</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-xs font-semibold text-slate-500 uppercase mb-1">Prayer</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2 gap-2 pb-2">
                            {prayerNames.map(p => (
                                <TouchableOpacity
                                    key={p}
                                    onPress={() => setNewAlarm({ ...newAlarm, prayerName: p as keyof PrayerTimes })}
                                    className={`px-4 py-2 rounded-lg border 
                      ${newAlarm.prayerName === p
                                            ? 'bg-emerald-600 border-emerald-600'
                                            : 'bg-white border-slate-200'}
                    `}
                                >
                                    <Text className={`text-sm ${newAlarm.prayerName === p ? 'text-white' : 'text-slate-600'}`}>
                                        {p}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <TouchableOpacity
                        onPress={handleAdd}
                        disabled={!newAlarm.message}
                        className={`w-full py-3 rounded-xl items-center ${!newAlarm.message ? 'bg-slate-300' : 'bg-slate-900'}`}
                    >
                        <Text className="text-white font-medium">Save Reminder</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View className="space-y-3 gap-3">
                {alarms.length === 0 && !isAdding && (
                    <View className="items-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Bell size={32} color="#cbd5e1" className="mb-2" />
                        <Text className="text-slate-500">No custom reminders set</Text>
                    </View>
                )}

                {alarms.map(alarm => (
                    <View key={alarm.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-row items-center justify-between">
                        <View className="flex-row items-center space-x-4 gap-3 flex-1">
                            <View className={`p-3 rounded-full ${alarm.enabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                <Clock size={20} color={alarm.enabled ? '#059669' : '#94a3b8'} />
                            </View>
                            <View>
                                <Text className={`font-medium ${alarm.enabled ? 'text-slate-800' : 'text-slate-400'}`}>{alarm.message}</Text>
                                <Text className="text-xs text-slate-500">
                                    {Math.abs(alarm.offsetMinutes)} min {alarm.offsetMinutes < 0 ? 'before' : 'after'} {alarm.prayerName}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center space-x-2 gap-2">
                            <Switch
                                value={alarm.enabled}
                                onValueChange={() => toggleAlarm(alarm.id)}
                                trackColor={{ false: "#cbd5e1", true: "#10b981" }}
                            />
                            <TouchableOpacity onPress={() => deleteAlarm(alarm.id)} className="p-2">
                                <Trash2 size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
