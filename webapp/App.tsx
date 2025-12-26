import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getPrayerTimes } from './webapp/services/prayerService';
import { PrayerData, Coordinates, CustomAlarm } from './types';
import { AdhkarCard } from './components/AdhkarCard';
import { AlarmManager } from './components/AlarmManager';
import { ADHKAR_DATA, ADHAN_AUDIO_URL } from './constants';
import { MapPin, Volume2, VolumeX, Moon, Sun, Settings, List, Clock } from 'lucide-react';

const REQUIRED_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function App() {
  // State
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prayers' | 'adhkar' | 'settings'>('prayers');
  const [nextPrayer, setNextPrayer] = useState<{ name: string, time: Date } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState<CustomAlarm[]>(() => {
    const saved = localStorage.getItem('customAlarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const processedNotifications = useRef<Set<string>>(new Set());

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(ADHAN_AUDIO_URL);
    audioRef.current.addEventListener('ended', () => setIsPlayingAdhan(false));
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Request Notification Permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Get Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setError('Location access denied. Please enable location for accurate prayer times.');
          // Default to Mecca coordinates for fallback
          setCoords({ latitude: 21.4225, longitude: 39.8262 });
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  // Fetch Prayer Times
  useEffect(() => {
    if (coords) {
      setLoading(true);
      getPrayerTimes(coords)
        .then(data => {
          setPrayerData(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch prayer times.');
          setLoading(false);
        });
    }
  }, [coords]);

  // Persist Alarms
  useEffect(() => {
    localStorage.setItem('customAlarms', JSON.stringify(alarms));
  }, [alarms]);

  // Clock & Next Prayer Calculation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (prayerData) {
        const timings = prayerData.timings;
        let upcoming = null;
        let minDiff = Infinity;

        // Parse today's prayers
        for (const prayer of REQUIRED_PRAYERS) {
          const timeStr = timings[prayer];
          // timeStr format is "HH:MM"
          const [hours, minutes] = timeStr.split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(hours, minutes, 0, 0);

          // If prayer time is earlier today, it might be next day's Fajr (handled below), 
          // but strictly for "next prayer today":
          if (prayerTime > now) {
            const diff = prayerTime.getTime() - now.getTime();
            if (diff < minDiff) {
              minDiff = diff;
              upcoming = { name: prayer, time: prayerTime };
            }
          }
        }

        // If no prayers left today, next is Fajr tomorrow
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


  // Notification & Alarm Logic
  useEffect(() => {
    if (!prayerData) return;

    const checkAlarms = () => {
      const now = new Date();

      // 1. Standard 5-min warning and Adhan
      REQUIRED_PRAYERS.forEach(prayerName => {
        const timeStr = prayerData.timings[prayerName];
        const [h, m] = timeStr.split(':').map(Number);
        const pTime = new Date();
        pTime.setHours(h, m, 0, 0);

        // Unique ID for today's notification
        const dateKey = now.toDateString();

        // Adhan Time (Window of 2 seconds)
        const diffMs = pTime.getTime() - now.getTime();
        const diffSec = diffMs / 1000;

        // Play Adhan
        if (Math.abs(diffSec) < 2) {
          const key = `adhan-${prayerName}-${dateKey}`;
          if (!processedNotifications.current.has(key)) {
            processedNotifications.current.add(key);
            if (isAudioEnabled && audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => console.error("Audio play failed", e));
              setIsPlayingAdhan(true);
            }
            new Notification(`It's time for ${prayerName}`, { body: 'Hayya alas-salah', icon: '/icon.png' });
          }
        }

        // 5 Min Warning
        if (diffSec > 0 && diffSec <= 300 && diffSec > 290) { // Approx 5 min mark window
          const key = `warn-${prayerName}-${dateKey}`;
          if (!processedNotifications.current.has(key)) {
            processedNotifications.current.add(key);
            new Notification(`${prayerName} is in 5 minutes!`, { body: 'Prepare for prayer.' });
          }
        }
      });

      // 2. Custom Alarms
      alarms.forEach(alarm => {
        if (!alarm.enabled) return;

        const timeStr = prayerData.timings[alarm.prayerName];
        if (!timeStr) return;
        const [h, m] = timeStr.split(':').map(Number);
        const baseTime = new Date();
        baseTime.setHours(h, m, 0, 0);

        const targetTime = new Date(baseTime.getTime() + alarm.offsetMinutes * 60000);
        const diffMs = targetTime.getTime() - now.getTime();

        // Trigger within a 10s window
        if (Math.abs(diffMs) < 10000) {
          const key = `custom-${alarm.id}-${now.toDateString()}`;
          if (!processedNotifications.current.has(key)) {
            processedNotifications.current.add(key);
            new Notification(alarm.message, { body: `Custom reminder for ${alarm.prayerName}` });
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, [prayerData, alarms, isAudioEnabled]);

  // UI Helpers
  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const getCountdown = () => {
    if (!nextPrayer) return 'Loading...';
    const diff = nextPrayer.time.getTime() - currentTime.getTime();
    if (diff < 0) return '00:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const enableAudio = () => {
    setIsAudioEnabled(true);
    // Play silence to unlock audio context on mobile
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        audioRef.current!.currentTime = 0;
      }).catch(e => console.log("Audio unlock failed", e));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">

      {/* Header */}
      <header className="bg-emerald-600 text-white p-6 pb-24 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Abstract Pattern */}
          <svg width="100%" height="100%">
            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Noor Daily</h1>
              <div className="flex items-center text-emerald-100 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{prayerData?.meta?.timezone || 'Auto Location'}</span>
              </div>
            </div>
            <button
              onClick={enableAudio}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isAudioEnabled ? 'bg-white/20 text-white' : 'bg-red-500/80 text-white animate-pulse'}`}
              title={isAudioEnabled ? "Audio Enabled" : "Tap to Enable Adhan"}
            >
              {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-emerald-100 text-sm uppercase tracking-widest mb-1">Next Prayer</p>
            <h2 className="text-4xl font-bold mb-2">{nextPrayer?.name || '--'}</h2>
            <div className="inline-block bg-black/20 backdrop-blur-md rounded-lg px-4 py-2">
              <span className="font-mono text-xl">{getCountdown()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto -mt-16 px-4 relative z-20 space-y-6">

        {/* Playback Overlay */}
        {isPlayingAdhan && (
          <div className="bg-emerald-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-ping"></div>
              <span className="font-medium">Adhan Playing...</span>
            </div>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  setIsPlayingAdhan(false);
                }
              }}
              className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30"
            >
              Stop
            </button>
          </div>
        )}

        {activeTab === 'prayers' && prayerData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {REQUIRED_PRAYERS.map((prayer, idx) => {
              const isActive = nextPrayer?.name === prayer;
              return (
                <div
                  key={prayer}
                  className={`flex justify-between items-center p-5 border-b border-slate-50 last:border-none transition-colors
                      ${isActive ? 'bg-emerald-50' : 'hover:bg-slate-50'}
                    `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                    <span className={`font-medium ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>{prayer}</span>
                  </div>
                  <span className={`font-mono ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                    {formatTime(prayerData.timings[prayer])}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'adhkar' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 ml-1">Daily Adhkar</h3>
            {ADHKAR_DATA.map(item => (
              <AdhkarCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <AlarmManager
            alarms={alarms}
            setAlarms={setAlarms}
            prayerNames={REQUIRED_PRAYERS}
          />
        )}

        {/* Hijri Date Footer */}
        {activeTab === 'prayers' && prayerData && (
          <div className="text-center text-slate-400 text-sm py-4">
            <p>{prayerData.date.readable}</p>
            <p className="font-arabic">{prayerData.date.hijri.day} {prayerData.date.hijri.month.ar} {prayerData.date.hijri.year}</p>
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('prayers')}
            className={`flex flex-col items-center space-y-1 w-16 transition-colors ${activeTab === 'prayers' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Clock size={24} strokeWidth={activeTab === 'prayers' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Prayers</span>
          </button>
          <button
            onClick={() => setActiveTab('adhkar')}
            className={`flex flex-col items-center space-y-1 w-16 transition-colors ${activeTab === 'adhkar' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <List size={24} strokeWidth={activeTab === 'adhkar' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Adhkar</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 w-16 transition-colors ${activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Planner</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
