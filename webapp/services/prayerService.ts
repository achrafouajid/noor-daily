import { Coordinates, PrayerData } from '../../types';

const BASE_URL = 'https://api.aladhan.com/v1';

export const getPrayerTimes = async (coords: Coordinates): Promise<PrayerData> => {
  try {
    const date = new Date();
    // Use the timestamp endpoint for most accurate current day timings based on location
    const timestamp = Math.floor(date.getTime() / 1000);
    const response = await fetch(
      `${BASE_URL}/timings/${timestamp}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=2` // Method 2: ISNA (North America) - widely accepted standard, or use auto detection if API supports
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};
