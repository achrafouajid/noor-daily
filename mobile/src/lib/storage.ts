import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

let storage: MMKV | null = null;

if (Platform.OS !== 'web') {
    storage = new MMKV();
}

export const getItem = <T>(key: string): T | null => {
    if (Platform.OS === 'web') {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    const value = storage?.getString(key);
    return value ? JSON.parse(value) : null;
};

export const setItem = <T>(key: string, value: T): void => {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, JSON.stringify(value));
        return;
    }

    storage?.set(key, JSON.stringify(value));
};

export const removeItem = (key: string): void => {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
    }
    storage?.delete(key);
};
