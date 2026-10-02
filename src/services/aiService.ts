import { EmotionType, AIResponse } from '../types';

export async function requestEncouragement(
  emotion: EmotionType,
  content: string,
  date: string
): Promise<AIResponse> {
  // 1. First try server-side proxy route (/api/gemini/encourage)
  try {
    const res = await fetch('/api/gemini/encourage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emotion, content, date }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.comfortLetter && data.suggestedAction) {
        return data as AIResponse;
      }
    } else {
      const errorJson = await res.json().catch(() => null);
      // If error specifically mentions API key missing, or endpoint not found
      if (res.status === 404) {
        // Fallback to client-side API if static Vercel deployment with VITE_GEMINI_API_KEY
        console.warn('/api/gemini/encourage returned 404, attempting client-side fallback if VITE_GEMINI_API_KEY is available');
      } else if (errorJson?.error) {
        throw new Error(errorJson.error);
      }
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('404') && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // 2. Direct client fallback using VITE_GEMINI_API_KEY (useful for static Vercel builds)
  const clientKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (clientKey) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientKey}`;
    const prompt = `사용자가 오늘 겪은 일과 감정을 기록한 일기입니다:
날짜: ${date}
감정: ${emotion}
일기 내용: "${content}"

당신은 따뜻하고 다정한 AI 비서 '하루벗'입니다.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "comfortLetter": "사용자의 감정과 일기에 대한 다정하고 따뜻한 위로와 공감의 편지(3~4문장)",
  "suggestedAction": "내일을 위한 실천하기 쉬운 작은 긍정 행동 1가지",
  "actionReason": "이 행동을 추천하는 따뜻한 이유(1문장)",
  "affirmation": "오늘 밤 마음에 안정을 주는 한 줄 긍정 확언"
}`;

    const clientRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!clientRes.ok) {
      const err = await clientRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gemini API 호출에 실패했습니다.');
    }

    const data = await clientRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      return JSON.parse(rawText) as AIResponse;
    }
  }

  throw new Error(
    'GEMINI_API_KEY가 설정되지 않았습니다. Vercel 환경 변수 또는 .env에 GEMINI_API_KEY를 등록해주세요.'
  );
}
