import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getPrayerTimes } from '@/api/prayer-service';
import { Coordinates, PrayerData } from '@/types';

export const usePrayerTimes = () => {
    const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationStatus, setLocationStatus] = useState<Location.PermissionStatus | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                setLocationStatus(status);

                if (status !== 'granted') {
                    setError('Permission to access location was denied');
                    // Default to Mecca
                    setCoords({ latitude: 21.4225, longitude: 39.8262 });
                    setLoading(false);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                setCoords({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            } catch (err) {
                setError('Error getting location: ' + (err as Error).message);
                setCoords({ latitude: 21.4225, longitude: 39.8262 });
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (coords) {
            setLoading(true);
            getPrayerTimes(coords)
                .then(data => {
                    setPrayerData(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to fetch prayer times');
                    setLoading(false);
                });
        }
    }, [coords]);

    return { prayerData, loading, error, locationStatus, coords };
};
