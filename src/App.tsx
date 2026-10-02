import React, { useState, useEffect, useRef } from 'react';
import { DiaryEntry, EmotionType, AIResponse } from './types';
import { Header } from './components/Header';
import { WarmQuoteWidget } from './components/WarmQuoteWidget';
import { DiaryForm } from './components/DiaryForm';
import { AIResponseCard } from './components/AIResponseCard';
import { DiaryList } from './components/DiaryList';
import { DiaryDetailModal } from './components/DiaryDetailModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { StatsBanner } from './components/StatsBanner';
import {
  fetchDiaryEntries,
  saveDiaryEntry,
  deleteDiaryEntry,
  toggleActionCompleted,
} from './services/diaryStorage';
import { Heart, Sparkles, Coffee } from 'lucide-react';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [latestResponse, setLatestResponse] = useState<{
    entry: DiaryEntry;
    aiResponse: AIResponse;
  } | null>(null);

  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const formRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Load diaries on initial mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoadingList(true);
        const data = await fetchDiaryEntries();
        setEntries(data);
      } catch (err) {
        console.error('Failed to load diaries:', err);
      } finally {
        setIsLoadingList(false);
      }
    }
    loadData();
  }, []);

  // When AI response is generated
  const handleDiarySuccess = async (data: {
    emotion: EmotionType;
    content: string;
    date: string;
    aiResponse: AIResponse;
  }) => {
    try {
      const savedEntry = await saveDiaryEntry({
        date: data.date,
        emotion: data.emotion,
        content: data.content,
        aiResponse: data.aiResponse,
        actionCompleted: false,
        createdAt: Date.now(),
      });

      // Update state
      setEntries((prev) => [savedEntry, ...prev.filter((e) => e.id !== savedEntry.id)]);
      setLatestResponse({
        entry: savedEntry,
        aiResponse: data.aiResponse,
      });

      // Smooth scroll to response card
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      console.error('Error saving diary:', err);
    }
  };

  const handleToggleAction = async (id: string, completed: boolean) => {
    // Optimistic UI update
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, actionCompleted: completed } : e))
    );
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry((prev) => (prev ? { ...prev, actionCompleted: completed } : null));
    }
    if (latestResponse && latestResponse.entry.id === id) {
      setLatestResponse((prev) =>
        prev
          ? {
              ...prev,
              entry: { ...prev.entry, actionCompleted: completed },
            }
          : null
      );
    }

    try {
      await toggleActionCompleted(id, completed);
    } catch (err) {
      console.error('Error toggling action:', err);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (latestResponse && latestResponse.entry.id === id) {
      setLatestResponse(null);
    }
    try {
      await deleteDiaryEntry(id);
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans text-stone-700 selection:bg-rose-200">
      {/* Top Header */}
      <Header
        totalCount={entries.length}
        onOpenGuide={() => setIsGuideOpen(true)}
        onScrollToForm={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onScrollToList={() => listRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Daily Warm Quote Widget (Random upon every visit) */}
        <section>
          <WarmQuoteWidget />
        </section>

        {/* Diary Form Section */}
        <section ref={formRef} className="scroll-mt-6">
          <DiaryForm
            onSuccess={handleDiarySuccess}
            isLoading={isGeneratingAI}
            setIsLoading={setIsGeneratingAI}
          />
        </section>

        {/* Latest AI Response Presentation */}
        {latestResponse && (
          <section ref={responseRef} className="scroll-mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <AIResponseCard
              emotion={latestResponse.entry.emotion}
              diaryContent={latestResponse.entry.content}
              response={latestResponse.aiResponse}
              date={latestResponse.entry.date}
              syncedToFirebase={latestResponse.entry.syncedToFirebase}
              isActionCompleted={latestResponse.entry.actionCompleted}
              onToggleAction={(completed) =>
                handleToggleAction(latestResponse.entry.id, completed)
              }
            />
          </section>
        )}

        {/* Statistics & Emotion Weather Summary */}
        <section>
          <StatsBanner entries={entries} />
        </section>

        {/* Past Diaries List */}
        <section ref={listRef} className="scroll-mt-6 pt-4">
          <DiaryList
            entries={entries}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            onToggleAction={handleToggleAction}
            isLoading={isLoadingList}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-rose-100 bg-white/70 py-8 px-4 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Firebase Firestore & Google Gemini API 안전 연동</span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-500">
            <span>만든 이: 따뜻한 하루 일기</span>
            <span>•</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300 inline" />
            <span>당신의 내일을 진심으로 응원합니다</span>
          </div>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-stone-500 hover:text-rose-600 underline underline-offset-2 cursor-pointer transition-colors"
          >
            Vercel 배포 및 환경 변수 안내
          </button>
        </div>
      </footer>

      {/* Diary Detail Modal */}
      <DiaryDetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onDelete={handleDeleteEntry}
        onToggleAction={handleToggleAction}
      />

      {/* Deployment & Security Guide Modal */}
      <DeploymentGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
