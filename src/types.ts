export type EmotionType = '기쁨' | '지침' | '설렘' | '불안';

export interface EmotionMeta {
  type: EmotionType;
  label: string;
  emoji: string;
  sublabel: string;
  bgPastel: string;
  borderPastel: string;
  badgeBg: string;
  badgeText: string;
  hoverBg: string;
  activeBorder: string;
  accentColor: string;
  gradient: string;
}

export interface AIResponse {
  comfortLetter: string;
  suggestedAction: string;
  actionReason: string;
  affirmation: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  emotion: EmotionType;
  content: string;
  aiResponse?: AIResponse;
  actionCompleted?: boolean;
  createdAt: number; // timestamp
  syncedToFirebase?: boolean;
}
