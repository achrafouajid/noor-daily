import React, { useState } from 'react';
import { AdhkarItem } from '../types';
import { Check, Repeat } from 'lucide-react';

interface AdhkarCardProps {
  item: AdhkarItem;
}

export const AdhkarCard: React.FC<AdhkarCardProps> = ({ item }) => {
  const [count, setCount] = useState(0);
  const isComplete = count >= item.count;

  const handleTap = () => {
    if (!isComplete) {
      setCount(prev => prev + 1);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
  };

  return (
    <div 
      onClick={handleTap}
      className={`relative p-5 rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer select-none
        ${isComplete 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-white border-slate-100 hover:border-emerald-200 active:scale-[0.98]'
        }
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider
          ${item.category === 'morning' ? 'bg-orange-100 text-orange-600' : 
            item.category === 'evening' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}
        `}>
          {item.category}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-400">{item.reference}</span>
          {isComplete && (
            <button 
              onClick={handleReset} 
              className="p-1 hover:bg-emerald-200 rounded-full text-emerald-600 transition-colors"
              title="Reset"
            >
              <Repeat size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="text-right text-2xl font-arabic leading-loose mb-4 text-slate-800 font-serif" dir="rtl">
        {item.arabic}
      </p>

      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        {item.translation}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
         <span className="text-xs text-slate-400">Tap card to count</span>
         <div className={`flex items-center space-x-2 text-lg font-bold 
           ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
            <span>{count}</span>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-slate-400">{item.count}</span>
            {isComplete && <Check size={20} className="ml-2" />}
         </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300 rounded-bl-2xl rounded-br-2xl" 
           style={{ width: `${Math.min((count / item.count) * 100, 100)}%` }}></div>
    </div>
  );
};
