# 🌸 따뜻한 하루 일기 & AI 응원 (Warm Daily Diary)

오늘의 감정(기쁨, 지침, 설렘, 불안)과 일기를 나누면, Google Gemini AI 비서 '하루벗'이 다정한 위로와 내일을 위한 긍정 행동 1가지를 선물하는 파스텔 힐링 다이어리 웹앱입니다.

---

## 🚀 GitHub에 올리고 Vercel로 배포하는 방법

### 1단계: GitHub 저장소에 푸시하기
로컬 터미널에서 다음 명령어로 깃허브 저장소에 코드를 올립니다:

```bash
# 깃 초기화 및 커밋
git init
git add .
git commit -m "feat: 따뜻한 하루 일기 웹앱 완성"

# 깃허브 원격 저장소 연결 및 푸시
git branch -M main
git remote add origin https://github.com/사용자아이디/저장소이름.git
git push -u origin main
```

> **보안 참고:** `.gitignore`에 `.env`, `.env*.local`이 등록되어 있어 비밀 키 파일은 깃허브에 올라가지 않습니다.

---

### 2단계: Vercel에서 프로젝트 가져오기 (Import)
1. [Vercel 공식 웹사이트](https://vercel.com)에 로그인합니다.
2. 대시보드 우측 상단의 **[Add New...]** > **[Project]** 를 클릭합니다.
3. 방금 푸시한 GitHub 저장소를 찾아서 **[Import]** 를 클릭합니다.
4. **Framework Preset**은 자동으로 `Vite`로 인식됩니다.
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

### 3단계: 환경 변수(Environment Variables) 등록하기 ⭐ (중요)
Vercel 배포 화면의 **Environment Variables** 설정 영역(또는 배포 후 Settings > Environment Variables)에 다음 값을 추가합니다:

| Key (이름) | Value (값) | 설명 |
|---|---|---|
| `GEMINI_API_KEY` | `AIzaSy... (본인의 Gemini API 키)` | Google AI Studio에서 발급받은 API 키 |

> **선택사항:** 정적 호스팅(SPA 단독 호출) 모드를 사용할 경우 `VITE_GEMINI_API_KEY`도 동일한 키로 등록할 수 있습니다.

입력 후 **[Deploy]** 버튼을 누르면 몇 초 안에 배포가 완료됩니다! 🎉

---

## 🛠️ 기술 스택 및 구조
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend / Serverless:** Vercel Serverless Function (`/api/gemini/encourage.ts`), Express (`server.ts`)
- **AI Engine:** Google Gemini API (`@google/genai` - `gemini-3.8-flash` with resilient fallbacks)
- **Database:** Firebase Firestore (`visit-6bded` 연동) + LocalStorage 오프라인 이중 백업
- **Routing Configuration:** `vercel.json` (SPA + Serverless Function 자동 라우팅)

---

## 💻 로컬에서 실행하기

1. 패키지 설치:
```bash
npm install
```

2. `.env` 파일 생성:
```bash
cp .env.example .env
# .env 파일을 열어 GEMINI_API_KEY="본인의_키" 를 입력합니다.
```

3. 개발 서버 실행:
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속
