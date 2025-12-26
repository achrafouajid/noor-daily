import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { AdhkarItem } from '../types';
import { Check, Repeat } from 'lucide-react-native';
import { MotiView } from 'moti';

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

    const handleReset = () => {
        setCount(0);
    };

    return (
        <TouchableOpacity
            onPress={handleTap}
            activeOpacity={0.9}
            className={`relative p-5 rounded-2xl shadow-sm border mb-4 
        ${isComplete
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-100'
                }
      `}
        >
            <View className="flex-row justify-between items-start mb-4">
                <View className={`px-2 py-1 rounded-full 
          ${item.category === 'morning' ? 'bg-orange-100' :
                        item.category === 'evening' ? 'bg-indigo-100' : 'bg-slate-100'}
        `}>
                    <Text className={`text-xs font-semibold uppercase tracking-wider
            ${item.category === 'morning' ? 'text-orange-600' :
                            item.category === 'evening' ? 'text-indigo-600' : 'text-slate-600'}
          `}>
                        {item.category}
                    </Text>
                </View>
                <View className="flex-row items-center space-x-2 gap-2">
                    <Text className="text-sm font-medium text-slate-400">{item.reference}</Text>
                    {isComplete && (
                        <TouchableOpacity
                            onPress={handleReset}
                            className="p-1 bg-emerald-100 rounded-full"
                        >
                            <Repeat size={14} color="#059669" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Text className="text-right text-2xl leading-loose mb-4 text-slate-800" style={{ fontFamily: 'System' }}>
                {item.arabic}
            </Text>

            <Text className="text-sm text-slate-600 leading-relaxed mb-6">
                {item.translation}
            </Text>

            <View className="flex-row items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <Text className="text-xs text-slate-400">Tap card to count</Text>
                <View className="flex-row items-center space-x-2 gap-1">
                    <Text className={`text-lg font-bold ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {count}
                    </Text>
                    <Text className="text-slate-300 font-light text-lg">/</Text>
                    <Text className="text-slate-400 text-lg">{item.count}</Text>
                    {isComplete && <Check size={20} color="#059669" />}
                </View>
            </View>

            {/* Progress Bar */}
            <View className="absolute bottom-0 left-0 right-0 h-1 bg-transparent rounded-bl-2xl rounded-br-2xl overflow-hidden">
                <MotiView
                    from={{ width: '0%' }}
                    animate={{ width: `${Math.min((count / item.count) * 100, 100)}%` }}
                    transition={{ type: 'timing', duration: 300 }}
                    className="h-full bg-emerald-500"
                />
            </View>
        </TouchableOpacity>
    );
};
