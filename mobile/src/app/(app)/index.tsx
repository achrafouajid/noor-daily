import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useNotifications } from '@/hooks/useNotifications';
import { useAdhanAudio } from '@/hooks/useAdhanAudio';
import { PrayerRow } from '@/components/PrayerRow';
import colors from '@/components/ui/colors';
import { MapPin, Volume2, VolumeX, Play, Pause, CircleStop } from 'lucide-react-native';

// Constants
const REQUIRED_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayersScreen() {
  const { prayerData, loading, error, coords } = usePrayerTimes();
  useNotifications(prayerData);
  const { playAdhan, stopAdhan, isPlaying } = useAdhanAudio();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{ name: string, time: Date } | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (prayerData) {
        const timings = prayerData.timings;
        let upcoming = null;
        let minDiff = Infinity;

        for (const prayer of REQUIRED_PRAYERS) {
          const timeStr = timings[prayer as keyof typeof timings];
          if (!timeStr) continue;

          const [hours, minutes] = timeStr.split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(hours, minutes, 0, 0);

          if (prayerTime > now) {
            const diff = prayerTime.getTime() - now.getTime();
            if (diff < minDiff) {
              minDiff = diff;
              upcoming = { name: prayer, time: prayerTime };
            }
          }
        }

        if (!upcoming) {
          const fajrStr = timings['Fajr'];
          const [fH, fM] = fajrStr.split(':').map(Number);
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(fH, fM, 0, 0);
          upcoming = { name: 'Fajr', time: tomorrow };
        }

        setNextPrayer(upcoming);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerData]);

  const getCountdown = () => {
    if (!nextPrayer) return 'Loading...';
    const diff = nextPrayer.time.getTime() - currentTime.getTime();
    if (diff < 0) return '00:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="bg-emerald-600 pt-16 pb-12 px-6 rounded-b-[40px] shadow-xl relative overflow-hidden">
        <View className="flex-row justify-between items-start mb-6 z-10">
          <View>
            <Text className="text-2xl font-bold text-white">Noor Daily</Text>
            <View className="flex-row items-center mt-1">
              <MapPin size={14} color="#d1fae5" />
              <Text className="text-emerald-100 text-sm ml-1">
                {prayerData?.meta?.timezone || 'Auto Location'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-full ${isAudioEnabled ? 'bg-white/20' : 'bg-red-500/80'}`}
          >
            {isAudioEnabled ? <Volume2 size={20} color="white" /> : <VolumeX size={20} color="white" />}
          </TouchableOpacity>
        </View>

        <View className="items-center mt-4 z-10">
          <Text className="text-emerald-100 text-sm uppercase tracking-widest mb-1">Next Prayer</Text>
          <Text className="text-4xl font-bold text-white mb-2">{nextPrayer?.name || '--'}</Text>

          <TouchableOpacity
            onPress={() => isPlaying ? stopAdhan() : playAdhan()}
            activeOpacity={0.9}
          >
            <View className={`flex-row items-center space-x-2 gap-2 rounded-lg px-4 py-2 backdrop-blur-md ${isPlaying ? 'bg-emerald-800 border border-emerald-400' : 'bg-black/20'}`}>
              {isPlaying && <CircleStop size={20} color="white" className="animate-pulse" />}
              <Text className="font-mono text-xl text-white">{isPlaying ? 'Stop' : getCountdown()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 -mt-10"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} />}
      >
        <View className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          {prayerData && REQUIRED_PRAYERS.map((prayer) => (
            <PrayerRow
              key={prayer}
              name={prayer}
              time={formatTime(prayerData.timings[prayer])}
              isActive={nextPrayer?.name === prayer}
            />
          ))}
        </View>

        {prayerData && (
          <View className="items-center mb-10">
            <Text className="text-slate-400 text-sm">{prayerData.date.readable}</Text>
            <Text className="text-slate-400 text-sm">{prayerData.date.hijri.day} {prayerData.date.hijri.month.ar} {prayerData.date.hijri.year}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
