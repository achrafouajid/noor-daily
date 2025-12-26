export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export interface PrayerData {
    timings: PrayerTimes;
    date: {
        readable: string;
        hijri: {
            date: string;
            day: string;
            month: {
                en: string;
                ar: string;
            };
            year: string;
        };
    };
    meta: {
        timezone: string;
    };
}

export interface AdhkarItem {
    id: string;
    arabic: string;
    transliteration?: string;
    translation: string;
    reference: string;
    count: number;
    category: 'morning' | 'evening' | 'general';
}

export interface CustomAlarm {
    id: string;
    prayerName: keyof PrayerTimes;
    offsetMinutes: number; // negative for before, positive for after
    message: string;
    enabled: boolean;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}
