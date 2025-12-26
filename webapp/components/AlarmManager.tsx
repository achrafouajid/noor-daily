import React, { useState, useEffect } from 'react';
import { CustomAlarm, PrayerTimes } from '../types';
import { Plus, Trash2, Bell, Clock } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Custom Reminders</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> <span>Add New</span></>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Message</label>
            <input 
              type="text" 
              placeholder="e.g. Read Surah Mulk"
              className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-emerald-500 outline-none"
              value={newAlarm.message}
              onChange={(e) => setNewAlarm({...newAlarm, message: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Timing</label>
               <div className="flex items-center space-x-2">
                 <input 
                    type="number"
                    className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={Math.abs(newAlarm.offsetMinutes || 0)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      // Keep the sign
                      const sign = (newAlarm.offsetMinutes || 0) < 0 ? -1 : 1;
                      setNewAlarm({...newAlarm, offsetMinutes: val * sign});
                    }}
                 />
                 <span className="text-slate-500 text-sm">min</span>
               </div>
            </div>
            <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Relative To</label>
               <div className="flex bg-slate-50 rounded-lg p-1">
                 <button 
                   onClick={() => setNewAlarm({...newAlarm, offsetMinutes: -Math.abs(newAlarm.offsetMinutes || 0)})}
                   className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${ (newAlarm.offsetMinutes || 0) < 0 ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}
                 >
                   Before
                 </button>
                 <button 
                   onClick={() => setNewAlarm({...newAlarm, offsetMinutes: Math.abs(newAlarm.offsetMinutes || 0)})}
                   className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${ (newAlarm.offsetMinutes || 0) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}
                 >
                   After
                 </button>
               </div>
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Prayer</label>
             <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
                {prayerNames.map(p => (
                  <button
                    key={p}
                    onClick={() => setNewAlarm({...newAlarm, prayerName: p as keyof PrayerTimes})}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap border transition-colors
                      ${newAlarm.prayerName === p 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}
                    `}
                  >
                    {p}
                  </button>
                ))}
             </div>
          </div>

          <button 
            onClick={handleAdd}
            disabled={!newAlarm.message}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-black transition-colors"
          >
            Save Reminder
          </button>
        </div>
      )}

      <div className="space-y-3">
        {alarms.length === 0 && !isAdding && (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
             <Bell className="mx-auto text-slate-300 mb-2" size={32} />
             <p className="text-slate-500">No custom reminders set</p>
          </div>
        )}
        
        {alarms.map(alarm => (
          <div key={alarm.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className={`p-3 rounded-full ${alarm.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                 <Clock size={20} />
               </div>
               <div>
                 <p className={`font-medium ${alarm.enabled ? 'text-slate-800' : 'text-slate-400'}`}>{alarm.message}</p>
                 <p className="text-xs text-slate-500">
                   {Math.abs(alarm.offsetMinutes)} min {alarm.offsetMinutes < 0 ? 'before' : 'after'} {alarm.prayerName}
                 </p>
               </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => toggleAlarm(alarm.id)}
                className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${alarm.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${alarm.enabled ? 'left-5' : 'left-1'}`} />
              </button>
              <button onClick={() => deleteAlarm(alarm.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
