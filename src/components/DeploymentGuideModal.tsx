import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, Terminal, ExternalLink, Key, Database } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const envExampleText = `# Gemini API 키 (서버 및 Vercel 환경 변수)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# (선택사항) 클라이언트 단독 빌드 시
VITE_GEMINI_API_KEY=""

# 포트 및 기본 설정
PORT=3000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-lg sm:text-xl">
                배포 & 보안 환경 변수 가이드
              </h3>
              <p className="text-xs text-stone-500">
                API 키를 안전하게 보관하고 Vercel에 배포하는 방법
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm text-stone-700 leading-relaxed">
          {/* Security Notice */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-1">안전한 API 키 관리 안내</strong>
              <p>
                API 키는 코드에 직접 하드코딩되지 않으며, 서버의 <code className="bg-white/80 px-1.5 py-0.5 rounded text-rose-700 font-mono">process.env.GEMINI_API_KEY</code> 또는 Vercel 환경 변수를 통해 안전하게 로드됩니다.
              </p>
            </div>
          </div>

          {/* Vercel Deployment Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-800 flex items-center gap-2 text-base">
              <span>1. Vercel 배포 시 환경 변수 설정</span>
            </h4>
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2.5 text-xs sm:text-sm">
              <p>Vercel 대시보드 프로젝트 설정에서 환경 변수를 등록하세요:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-stone-600 ml-1">
                <li>
                  Vercel 대시보드 &gt; 해당 프로젝트 &gt; <strong>Settings</strong> &gt; <strong>Environment Variables</strong>로 이동
                </li>
                <li>
                  <strong>Key</strong>: <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono font-bold text-stone-800">GEMINI_API_KEY</code>
                </li>
                <li>
                  <strong>Value</strong>: Google AI Studio에서 발급받은 본인의 Gemini API 키 입력
                </li>
                <li>
                  (정적 호스팅 단독 모드 사용 시): <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono font-bold text-stone-800">VITE_GEMINI_API_KEY</code> 도 함께 지원됩니다.
                </li>
              </ol>
            </div>
          </div>

          {/* .env.example Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-800 flex items-center gap-2 text-base">
                <Terminal className="w-4 h-4 text-rose-500" />
                <span>2. 로컬 테스트용 .env.example</span>
              </h4>
              <button
                onClick={() => copyText('env', envExampleText)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'env' ? '복사됨' : '복사하기'}</span>
              </button>
            </div>
            <pre className="bg-stone-900 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto">
              {envExampleText}
            </pre>
          </div>

          {/* Firebase Database Connection Status */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-800 flex items-center gap-2 text-base">
              <Database className="w-4 h-4 text-amber-500" />
              <span>3. 내 Firebase 데이터베이스 연동 현황</span>
            </h4>
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 text-xs sm:text-sm text-emerald-900 space-y-1">
              <p className="font-semibold">
                프로젝트 ID: <code className="font-mono bg-white px-1.5 py-0.5 rounded text-emerald-800">visit-6bded</code>
              </p>
              <p className="text-emerald-700">
                사용자님의 Firebase Firestore 설정이 <code className="font-mono text-emerald-800">src/firebase.ts</code>에 안전하게 연동되었습니다. 작성한 일기와 AI 답장은 자동으로 Firestore 및 로컬 캐시에 이중 백업됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 flex justify-end bg-stone-50/60 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
