import React, { useState, useEffect } from 'react';
import { WARM_QUOTES, WarmQuote } from '../constants/quotes';
import { Sparkles, RefreshCw, Quote, Copy, Check, Heart } from 'lucide-react';

export const WarmQuoteWidget: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<WarmQuote>(() => {
    // Pick a random quote on initial render
    const randomIndex = Math.floor(Math.random() * WARM_QUOTES.length);
    return WARM_QUOTES[randomIndex];
  });
  const [isRotating, setIsRotating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleNextQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      // Pick a different random quote
      let nextIndex = Math.floor(Math.random() * WARM_QUOTES.length);
      if (WARM_QUOTES.length > 1 && WARM_QUOTES[nextIndex].id === currentQuote.id) {
        nextIndex = (nextIndex + 1) % WARM_QUOTES.length;
      }
      setCurrentQuote(WARM_QUOTES[nextIndex]);
      setIsRotating(false);
      setCopied(false);
      setLiked(false);
    }, 200);
  };

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy quote:', err);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case '위로':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case '용기':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case '휴식':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case '사랑':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case '희망':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50/90 via-rose-50/70 to-pink-50/80 border border-rose-200/70 p-4 sm:p-5 shadow-xs transition-all duration-300 hover:shadow-sm">
      {/* Decorative ambient blurred dots */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-rose-200/30 blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-amber-200/30 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Tag and Quote */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-white/90 text-rose-400 shadow-2xs shrink-0 mt-0.5 border border-rose-100">
            <Quote className="w-4 h-4 fill-rose-100" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                오늘 마음에 닿는 한 줄
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getCategoryBadgeClass(
                  currentQuote.category
                )}`}
              >
                {currentQuote.category}
              </span>
            </div>

            <p className="text-stone-800 text-sm sm:text-base font-medium leading-relaxed italic pr-2">
              &ldquo;{currentQuote.text}&rdquo;
            </p>

            <p className="text-xs text-stone-500 font-normal">
              — {currentQuote.author}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-1 sm:pt-0">
          {/* Like/Heart button */}
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            title={liked ? '마음에 담았어요' : '마음에 담기'}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
              liked
                ? 'bg-rose-100 text-rose-600 border-rose-300'
                : 'bg-white/80 hover:bg-white text-stone-500 hover:text-rose-500 border-rose-100'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="text-[11px] hidden sm:inline">
              {liked ? '담음' : '공감'}
            </span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopyQuote}
            title="명언 복사하기"
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-stone-500 hover:text-stone-800 border border-rose-100 text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] text-emerald-600">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">복사</span>
              </>
            )}
          </button>

          {/* Shuffle Next Quote button */}
          <button
            type="button"
            onClick={handleNextQuote}
            title="다른 따뜻한 명언 보기"
            className="px-2.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`}
            />
            <span className="text-[11px]">다른 명언</span>
          </button>
        </div>
      </div>
    </div>
  );
};
