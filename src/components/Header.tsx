import React from 'react';
import { Heart, Sparkles, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onOpenGuide: () => void;
  onScrollToForm: () => void;
  onScrollToList: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  onOpenGuide,
  onScrollToForm,
  onScrollToList,
}) => {
  const today = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());

  return (
    <header className="relative overflow-hidden border-b border-rose-100/80 bg-gradient-to-r from-amber-50/90 via-rose-50/80 to-purple-50/90 py-8 px-4 sm:px-6">
      <div className="absolute top-0 right-10 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-200/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-200/25 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-rose-200/60 text-xs font-medium text-rose-700 shadow-xs mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>오늘도 애쓴 당신을 위한 다정한 공간</span>
            <span className="text-rose-300">•</span>
            <span>{today}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-800 flex items-center gap-2.5">
            <span>따뜻한 하루 일기</span>
            <span className="text-rose-400 font-normal">&</span>
            <span className="text-rose-600">AI 응원</span>
            <Heart className="w-6 h-6 text-rose-400 fill-rose-300 inline animate-bounce" />
          </h1>

          <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
            마음속 감정을 털어놓으면, AI 비서 <strong className="text-rose-700 font-semibold">하루벗</strong>이 
            다정한 위로와 <span className="underline decoration-rose-300 decoration-2 underline-offset-4">내일을 위한 긍정 행동 1가지</span>를 건네줍니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 text-xs sm:text-sm font-medium border border-rose-200/80 shadow-xs transition-all hover:shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>일기 쓰기</span>
          </button>

          <button
            onClick={onScrollToList}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-medium border border-stone-200/80 shadow-xs transition-all hover:shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span>나의 기록 ({totalCount})</span>
          </button>

          <button
            onClick={onOpenGuide}
            title="Vercel 배포 및 환경 변수 안내"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-100/70 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-medium border border-rose-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span>배포 안내</span>
          </button>
        </div>
      </div>
    </header>
  );
};
