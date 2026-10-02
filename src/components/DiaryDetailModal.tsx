import React from 'react';
import { DiaryEntry } from '../types';
import { EMOTIONS } from '../constants/emotions';
import { X, Calendar, Sparkles, Compass, Moon, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface DiaryDetailModalProps {
  entry: DiaryEntry | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleAction: (id: string, completed: boolean) => void;
}

export const DiaryDetailModal: React.FC<DiaryDetailModalProps> = ({
  entry,
  onClose,
  onDelete,
  onToggleAction,
}) => {
  if (!entry) return null;

  const emotionMeta = EMOTIONS[entry.emotion] || EMOTIONS['기쁨'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emotionMeta.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${emotionMeta.badgeBg} ${emotionMeta.badgeText}`}>
                  {entry.emotion}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {entry.date}
                </span>
              </div>
              <h3 className="font-bold text-stone-800 text-lg mt-0.5">
                그날의 일기와 따뜻한 답장
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* User's Diary */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              내가 남긴 기록
            </h4>
            <div className="bg-amber-50/40 rounded-2xl p-4 sm:p-5 border border-amber-100 text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </div>
          </div>

          {/* AI Response if available */}
          {entry.aiResponse ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 비서 하루벗의 다정한 위로</span>
                </h4>
                <div className="bg-rose-50/50 rounded-2xl p-4 sm:p-5 border border-rose-100 text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {entry.aiResponse.comfortLetter}
                </div>
              </div>

              {/* Action Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/80">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>추천 행동</span>
                  </div>

                  <button
                    onClick={() => onToggleAction(entry.id, !entry.actionCompleted)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-stone-700 hover:text-emerald-600 border border-stone-200 transition-colors cursor-pointer"
                  >
                    {entry.actionCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-700">실천 완료</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-stone-400" />
                        <span>실천하기</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="font-semibold text-stone-900 text-sm sm:text-base">
                  {entry.aiResponse.suggestedAction}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {entry.aiResponse.actionReason}
                </p>
              </div>

              {/* Night Affirmation */}
              {entry.aiResponse.affirmation && (
                <div className="flex items-center gap-2.5 bg-indigo-50/60 rounded-xl p-3 border border-indigo-100 text-indigo-900 text-xs">
                  <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="italic">{entry.aiResponse.affirmation}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-stone-400 text-center py-4">
              AI 응답이 기록되지 않은 일기입니다.
            </p>
          )}
        </div>

        {/* Footer with Delete */}
        <div className="p-4 sm:p-5 border-t border-stone-100 flex items-center justify-between bg-stone-50/60 rounded-b-3xl">
          <button
            onClick={() => {
              if (confirm('이 일기를 삭제하시겠습니까?')) {
                onDelete(entry.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>일기 삭제</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 text-white hover:bg-stone-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
