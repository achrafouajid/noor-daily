import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { PrayerData } from '@/types';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const useNotifications = (prayerData: PrayerData | null) => {
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification Received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Response:', response);
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    // Schedule Prayer Notifications
    useEffect(() => {
        if (!prayerData) return;
        if (Platform.OS === 'web') return;

        const schedulePrayers = async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();

            const timings = prayerData.timings;
            const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            const now = new Date();

            for (const prayer of prayers) {
                const timeStr = timings[prayer as keyof typeof timings];
                if (!timeStr) continue;

                const [h, m] = timeStr.split(':').map(Number);
                const prayerTime = new Date();
                prayerTime.setHours(h, m, 0, 0);

                if (prayerTime > now) {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "It's time for " + prayer,
                            body: "Hayya alas-salah",
                            sound: true,
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.DATE,
                            date: prayerTime,
                        },
                    });
                }
            }
        };

        schedulePrayers();
    }, [prayerData]);
};

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        return;
    }
}
