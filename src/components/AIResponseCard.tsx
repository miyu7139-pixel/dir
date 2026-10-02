import React, { useState, useEffect } from 'react';
import { AIResponse, EmotionType } from '../types';
import { EMOTIONS } from '../constants/emotions';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Compass,
  Moon,
  BookmarkCheck,
  CloudCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIResponseCardProps {
  emotion: EmotionType;
  diaryContent: string;
  response: AIResponse;
  date: string;
  syncedToFirebase?: boolean;
  onToggleAction?: (completed: boolean) => void;
  isActionCompleted?: boolean;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  emotion,
  diaryContent,
  response,
  date,
  syncedToFirebase = true,
  onToggleAction,
  isActionCompleted = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completed, setCompleted] = useState(isActionCompleted);

  const emotionMeta = EMOTIONS[emotion] || EMOTIONS['기쁨'];

  // Trigger gentle confetti on initial load of AI response
  useEffect(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FDA4AF', '#FCD34D', '#A7F3D0', '#BAE6FD'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopy = async () => {
    const fullText = `[따뜻한 하루 일기 & AI 응원 - ${date}]\n내 감정: ${emotion}\n\n[나의 일기]\n${diaryContent}\n\n[AI 비서 하루벗의 답장]\n${response.comfortLetter}\n\n[내일을 위한 선물: 긍정 행동]\n${response.suggestedAction}\n(${response.actionReason})\n\n[오늘 밤의 확언]\n${response.affirmation}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('현재 브라우저에서는 음성 읽기 기능을 지원하지 않습니다.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${response.comfortLetter} 내일을 위한 작은 선물입니다. ${response.suggestedAction}. ${response.affirmation}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // gentle and slow pace
    utterance.pitch = 1.05;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleActionToggle = () => {
    const nextVal = !completed;
    setCompleted(nextVal);
    if (onToggleAction) {
      onToggleAction(nextVal);
    }
    if (nextVal) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#34D399', '#6EE7B7'],
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-rose-50/40 to-amber-50/50 rounded-3xl p-6 sm:p-8 border border-rose-200/90 shadow-md relative overflow-hidden transition-all duration-300">
      {/* Top Header line */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-rose-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-400 flex items-center justify-center text-white shadow-xs">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-base sm:text-lg">
                AI 비서 하루벗의 다정한 편지
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${emotionMeta.badgeBg} ${emotionMeta.badgeText}`}>
                {emotionMeta.emoji} {emotionMeta.label}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {date}의 마음에 건네는 온기
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSpeak}
            title={isSpeaking ? '음성 멈추기' : '다정한 목소리로 읽어주기'}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600 border-stone-200'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? '멈추기' : '듣기'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="편지 복사하기"
            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600 border border-stone-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? '복사됨' : '복사'}</span>
          </button>
        </div>
      </div>

      {/* Main Comfort Letter */}
      <div className="my-6 relative bg-white/80 backdrop-blur-xs rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-xs">
        <span className="text-4xl text-rose-200 font-serif leading-none select-none block -mb-2">
          &ldquo;
        </span>
        <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal whitespace-pre-line pl-2">
          {response.comfortLetter}
        </p>
        <span className="text-4xl text-rose-200 font-serif leading-none select-none block text-right -mt-2">
          &rdquo;
        </span>
      </div>

      {/* Tomorrow's Positive Action Box (Core Requirement) */}
      <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-rose-50/90 rounded-2xl p-5 border border-amber-200/80 shadow-xs my-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm sm:text-base">
            <span className="p-1.5 rounded-lg bg-amber-200/80 text-amber-900">
              <Compass className="w-4 h-4" />
            </span>
            <span>내일을 위한 작은 선물 (추천 행동 1가지)</span>
          </div>

          <button
            onClick={handleActionToggle}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              completed
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-white/90 hover:bg-white text-stone-600 border border-amber-300'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${completed ? 'stroke-[3]' : ''}`} />
            <span>{completed ? '실천 완료!' : '내일 실천하기'}</span>
          </button>
        </div>

        <div className="mt-3 bg-white/90 rounded-xl p-4 border border-amber-100/90">
          <p className="text-stone-900 font-semibold text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{response.suggestedAction}</span>
          </p>
          <p className="text-stone-600 text-xs sm:text-sm mt-1.5 pl-6 leading-relaxed">
            {response.actionReason}
          </p>
        </div>
      </div>

      {/* Bedtime Affirmation */}
      <div className="flex items-center gap-3 bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 text-indigo-900 text-xs sm:text-sm">
        <Moon className="w-5 h-5 text-indigo-500 shrink-0" />
        <div className="flex-1">
          <span className="font-semibold block text-indigo-950 text-xs mb-0.5">
            오늘 밤의 마음 쉼표
          </span>
          <span className="italic">{response.affirmation}</span>
        </div>
      </div>

      {/* Storage and Save indicator footer */}
      <div className="mt-5 pt-4 border-t border-rose-100/80 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-1.5">
          <BookmarkCheck className="w-4 h-4 text-rose-400" />
          <span>일기와 답장이 나의 일기장에 안전하게 보관되었습니다.</span>
        </div>

        {syncedToFirebase && (
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <CloudCheck className="w-3.5 h-3.5" />
            <span>Firebase 저장 완료</span>
          </div>
        )}
      </div>
    </div>
  );
};
