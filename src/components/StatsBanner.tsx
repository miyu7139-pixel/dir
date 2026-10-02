import React from 'react';
import { DiaryEntry, EmotionType } from '../types';
import { EMOTIONS } from '../constants/emotions';
import { Flame, Sparkles, Smile } from 'lucide-react';

interface StatsBannerProps {
  entries: DiaryEntry[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ entries }) => {
  if (entries.length === 0) return null;

  // Count emotions
  const emotionCounts: Record<EmotionType, number> = {
    기쁨: 0,
    지침: 0,
    설렘: 0,
    불안: 0,
  };

  entries.forEach((e) => {
    if (emotionCounts[e.emotion] !== undefined) {
      emotionCounts[e.emotion]++;
    }
  });

  // Calculate unique days written
  const uniqueDates = new Set(entries.map((e) => e.date));
  const totalDays = uniqueDates.size;

  return (
    <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-rose-100 text-rose-600">
            <Smile className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-stone-800 text-sm sm:text-base">
            마음 날씨 통계
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>함께한 기록 {totalDays}일의 여정</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        {(Object.keys(emotionCounts) as EmotionType[]).map((emoKey) => {
          const count = emotionCounts[emoKey];
          const meta = EMOTIONS[emoKey];
          const percent = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;

          return (
            <div
              key={emoKey}
              className={`p-3.5 rounded-2xl border ${meta.bgPastel} ${meta.borderPastel} flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <span className="text-xs font-bold text-stone-700 block">{emoKey}</span>
                  <span className="text-[11px] text-stone-400">{percent}%</span>
                </div>
              </div>
              <span className="font-bold text-stone-800 text-lg sm:text-xl">
                {count}<span className="text-xs font-normal text-stone-500 ml-0.5">회</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
