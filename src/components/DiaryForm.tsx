import React, { useState } from 'react';
import { EmotionType, AIResponse } from '../types';
import { EmotionSelector } from './EmotionSelector';
import { SAMPLE_PROMPTS } from '../constants/emotions';
import { Sparkles, Calendar, PenTool, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { requestEncouragement } from '../services/aiService';

interface DiaryFormProps {
  onSuccess: (data: {
    emotion: EmotionType;
    content: string;
    date: string;
    aiResponse: AIResponse;
  }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({
  onSuccess,
  isLoading,
  setIsLoading,
}) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(getTodayString());
  const [emotion, setEmotion] = useState<EmotionType>('기쁨');
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('오늘 마음에 남았던 일이나 생각을 조금만 적어주세요.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await requestEncouragement(emotion, content.trim(), date);
      onSuccess({
        emotion,
        content: content.trim(),
        date,
        aiResponse: response,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.message || 'AI 비서와의 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySample = (text: string) => {
    setContent(text);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm relative overflow-hidden">
      {/* Decorative gentle gradient corner */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-rose-100/50 to-transparent pointer-events-none rounded-bl-full" />

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Date and title line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <PenTool className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-800">
                오늘의 하루 기록하기
              </h2>
              <p className="text-xs text-stone-500">
                작은 일이라도 솔직하게 적어주시면 AI 하루벗이 다정하게 읽어드려요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 px-3.5 py-1.5 rounded-xl border border-stone-200/80 text-sm">
            <Calendar className="w-4 h-4 text-stone-500" />
            <input
              type="date"
              value={date}
              max={getTodayString()}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-stone-700 font-medium focus:outline-hidden text-sm cursor-pointer"
            />
          </div>
        </div>

        {/* Emotion selector */}
        <EmotionSelector selectedEmotion={emotion} onChange={setEmotion} />

        {/* Diary Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="diary-content" className="block text-sm font-semibold text-stone-700">
              오늘 무슨 일이 있었나요? 어떤 생각이 맴돌았나요? <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-stone-400">
              {content.length}자
            </span>
          </div>

          <textarea
            id="diary-content"
            rows={5}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="예) 오늘 회사에서 예상치 못하게 좋은 칭찬을 들어서 기분이 날아갈 것 같았어요. 그런데 내일 할 일도 많아서 조금 부담스럽기도 해요..."
            className="w-full px-4 py-3.5 rounded-2xl bg-amber-50/20 border border-stone-200 focus:border-rose-300 focus:ring-3 focus:ring-rose-100 transition-all text-stone-800 placeholder:text-stone-400 text-sm sm:text-base leading-relaxed resize-none"
          />
        </div>

        {/* Inspiration chips */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>생각이 잘 떠오르지 않는다면 눌러보세요:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(promptText)}
                className="text-xs px-3 py-1.5 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-rose-700 border border-stone-200/70 text-stone-600 transition-colors text-left"
              >
                &ldquo;{promptText}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1">
              <p className="font-semibold">잠시 확인해주세요</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white shadow-md transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
              isLoading
                ? 'bg-rose-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-400 via-rose-500 to-amber-500 hover:from-rose-500 hover:via-rose-600 hover:to-amber-600 hover:shadow-rose-300/40 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI 비서 하루벗이 따뜻한 답장을 쓰는 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                <span>AI 비서에게 일기 보여주기</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-stone-400 mt-2.5">
            안전한 Google Gemini API를 통해 따뜻한 위로와 내일을 위한 제안이 생성됩니다.
          </p>
        </div>
      </form>
    </div>
  );
};
