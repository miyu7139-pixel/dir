import { GoogleGenAI, Type } from '@google/genai';

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel deployments
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { emotion, content, date } = body || {};

    if (!emotion || !content) {
      return res.status(400).json({ error: '감정과 일기 내용을 모두 입력해주세요.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. Vercel 대시보드의 Environment Variables에 GEMINI_API_KEY를 등록해주세요.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `사용자가 오늘 겪은 일과 감정을 기록한 일기입니다:
날짜: ${date || '오늘'}
선택한 감정: ${emotion}
일기 내용:
"${content}"

당신은 사용자의 마음을 어루만져 주는 따뜻하고 사려 깊은 AI 비서 '하루벗'입니다.
1. 사용자가 겪은 일과 감정(${emotion})에 깊이 공감하고, 진심 어린 위로와 응원의 편지를 작성해주세요.
2. 내일을 더욱 밝고 편안하게 맞이할 수 있도록 부담 없이 실천할 수 있는 구체적인 긍정적 행동 1가지를 제안해주세요.
3. 그 행동을 제안하는 다정한 이유와, 오늘 밤 마음에 평온을 줄 수 있는 한 줄 확언을 함께 작성해주세요.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;
    let responseText: string | undefined;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: '당신은 부드럽고 다정한 파스텔 감성의 AI 비서 "하루벗"입니다. 사용자에게 편안하고 위로가 되는 어조(~해요, ~했군요, ~해볼까요)로 이야기합니다. 절대 차갑거나 기계적인 어투를 쓰지 않습니다.',
            temperature: 0.75,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                comfortLetter: {
                  type: Type.STRING,
                  description: '사용자의 일기와 감정에 대한 다정하고 사려 깊은 위로와 공감의 편지 (3~5문장, 따뜻한 한국어 구어체)',
                },
                suggestedAction: {
                  type: Type.STRING,
                  description: '내일을 위한 실천하기 쉬운 작고 긍정적인 행동 1가지 (예: 아침에 창문을 열고 10초 동안 맑은 공기 들이마시기)',
                },
                actionReason: {
                  type: Type.STRING,
                  description: '이 행동을 추천하는 따뜻한 이유 (1~2문장)',
                },
                affirmation: {
                  type: Type.STRING,
                  description: '오늘 밤 마음에 안정을 주는 한 줄 따뜻한 긍정 확언',
                },
              },
              required: ['comfortLetter', 'suggestedAction', 'actionReason', 'affirmation'],
            },
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Vercel function model ${modelName} retry:`, err?.message || err);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error('Gemini API로부터 응답을 받지 못했습니다.');
    }

    const parsedData = JSON.parse(responseText);
    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('Vercel serverless error:', error);
    return res.status(500).json({
      error: error?.message || 'AI 비서의 응답을 생성하는 중 오류가 발생했습니다.'
    });
  }
}
