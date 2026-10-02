import React, { useState } from 'react';
import { DiaryEntry, EmotionType } from '../types';
import { EMOTIONS } from '../constants/emotions';
import {
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  Compass,
  CheckCircle2,
  Circle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface DiaryListProps {
  entries: DiaryEntry[];
  onSelectEntry: (entry: DiaryEntry) => void;
  onToggleAction: (id: string, completed: boolean) => void;
  isLoading: boolean;
}

export const DiaryList: React.FC<DiaryListProps> = ({
  entries,
  onSelectEntry,
  onToggleAction,
  isLoading,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'전체' | EmotionType>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filterKeys: Array<'전체' | EmotionType> = ['전체', '기쁨', '지침', '설렘', '불안'];

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = selectedFilter === '전체' || entry.emotion === selectedFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.aiResponse?.comfortLetter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.aiResponse?.suggestedAction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const completedActionsCount = entries.filter((e) => e.actionCompleted).length;

  return (
    <div className="space-y-6">
      {/* Section Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-800">
              마음 보관함 (지난 일기들)
            </h2>
            <p className="text-xs text-stone-500">
              차곡차곡 쌓인 나의 하루들과 하루벗이 남겨준 다정한 답장들
            </p>
          </div>
        </div>

        {/* Small stats pill */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>총 {entries.length}편의 일기</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>실천 완료 {completedActionsCount}개</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Emotion filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {filterKeys.map((key) => {
            const isSelected = selectedFilter === key;
            const emoji = key !== '전체' ? EMOTIONS[key].emoji : '🌱';
            const count =
              key === '전체'
                ? entries.length
                : entries.filter((e) => e.emotion === key).length;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedFilter(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <span>{emoji}</span>
                <span>{key}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="일기 내용 또는 응원 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 rounded-xl text-xs text-stone-700 placeholder:text-stone-400 border border-stone-200 focus:border-rose-300 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Loading or List */}
      {isLoading ? (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-stone-100">
          <div className="w-8 h-8 border-3 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-500 text-sm">일기장을 불러오는 중이에요...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-rose-100/80 p-8 shadow-xs">
          <span className="text-5xl block mb-3">📖</span>
          <h3 className="text-base sm:text-lg font-bold text-stone-700 mb-1">
            {searchQuery || selectedFilter !== '전체'
              ? '조건에 맞는 일기를 찾을 수 없어요'
              : '아직 기록된 일기가 없어요'}
          </h3>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            {searchQuery || selectedFilter !== '전체'
              ? '다른 감정 탭을 누르거나 검색어를 지워보세요.'
              : '오늘 하루의 감정과 이야기를 가볍게 적고 하루벗의 따뜻한 답장을 받아보세요!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => {
            const itemMeta = EMOTIONS[entry.emotion] || EMOTIONS['기쁨'];

            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="group bg-white hover:bg-stone-50/80 rounded-3xl p-5 border border-stone-200/70 hover:border-rose-300 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card top info */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{itemMeta.emoji}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${itemMeta.badgeBg} ${itemMeta.badgeText}`}
                      >
                        {entry.emotion}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{entry.date}</span>
                    </div>
                  </div>

                  {/* Diary content excerpt */}
                  <p className="text-stone-800 text-sm font-medium line-clamp-2 leading-relaxed mb-3">
                    {entry.content}
                  </p>

                  {/* AI Response snippet if available */}
                  {entry.aiResponse && (
                    <div className="bg-rose-50/40 rounded-2xl p-3 border border-rose-100/60 mb-3">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mb-1">
                        <Sparkles className="w-3 h-3 text-rose-500" />
                        <span>하루벗의 위로</span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {entry.aiResponse.comfortLetter}
                      </p>
                    </div>
                  )}

                  {/* Suggested Action pill */}
                  {entry.aiResponse?.suggestedAction && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-700 min-w-0">
                        <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate font-medium">
                          {entry.aiResponse.suggestedAction}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleAction(entry.id, !entry.actionCompleted);
                        }}
                        title={entry.actionCompleted ? '실천 완료됨' : '실천 완료로 체크'}
                        className="shrink-0 text-stone-400 hover:text-emerald-600 p-0.5"
                      >
                        {entry.actionCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer read more */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 group-hover:text-rose-500 transition-colors">
                  <span>자세히 읽기</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
