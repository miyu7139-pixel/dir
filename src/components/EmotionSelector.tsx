import React from 'react';
import { EmotionType } from '../types';
import { EMOTIONS } from '../constants/emotions';
import { Check } from 'lucide-react';

interface EmotionSelectorProps {
  selectedEmotion: EmotionType;
  onChange: (emotion: EmotionType) => void;
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotion,
  onChange,
}) => {
  const emotionKeys: EmotionType[] = ['기쁨', '지침', '설렘', '불안'];

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-stone-700 mb-2.5">
        오늘 나의 마음은 어떤 계절을 지나고 있나요? <span className="text-rose-500">*</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {emotionKeys.map((key) => {
          const item = EMOTIONS[key];
          const isSelected = selectedEmotion === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 text-center cursor-pointer select-none ${
                isSelected
                  ? `${item.activeBorder} shadow-sm scale-[1.02]`
                  : `${item.bgPastel} ${item.borderPastel} ${item.hoverBg} hover:border-stone-300 opacity-80 hover:opacity-100`
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center text-rose-500">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
              <span className="text-3xl sm:text-4xl mb-1.5 filter drop-shadow-xs transform transition-transform group-hover:scale-110">
                {item.emoji}
              </span>
              <span className="font-bold text-stone-800 text-base">{item.label}</span>
              <span className="text-[11px] text-stone-500 mt-1 line-clamp-1 leading-snug">
                {item.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
