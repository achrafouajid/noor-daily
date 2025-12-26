import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { ADHAN_AUDIO_URL } from '@/lib/constants';

export const useAdhanAudio = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const playAdhan = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: ADHAN_AUDIO_URL },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                }
            });
        } catch (error) {
            console.error('Error playing adhan:', error);
        }
    };

    const stopAdhan = async () => {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    };

    return { playAdhan, stopAdhan, isPlaying };
};
