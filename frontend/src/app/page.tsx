'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 사용자 정보 확인 (임시)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">로드 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-prime-900 text-2xl font-semibold">MindLog</h1>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-cta-300 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-neutral-200 bg-secondary-100 p-8">
          <h2 className="text-prime-900 mb-4 text-3xl font-bold">
            MindLog에 오신 것을 환영합니다! 🎉
          </h2>
          <p className="text-prime-600 mb-8 text-lg">
            당신의 마음을 기록하고, 감정을 추적하세요.
          </p>

          {/* 기능 카드들 */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* 일기 카드 */}
            <div className="rounded-lg border border-cta-300/30 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="text-cta-300 mb-3 text-3xl">📔</div>
              <h3 className="text-prime-900 mb-2 text-lg font-semibold">일기 작성</h3>
              <p className="text-prime-600 text-sm">
                매일의 감정과 생각을 기록하세요.
              </p>
            </div>

            {/* 감정 분석 카드 */}
            <div className="rounded-lg border border-cta-300/30 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="text-cta-300 mb-3 text-3xl">📊</div>
              <h3 className="text-prime-900 mb-2 text-lg font-semibold">감정 분석</h3>
              <p className="text-prime-600 text-sm">
                시간에 따른 감정 변화를 시각화하세요.
              </p>
            </div>

            {/* 채팅 카드 */}
            <div className="rounded-lg border border-cta-300/30 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="text-cta-300 mb-3 text-3xl">💬</div>
              <h3 className="text-prime-900 mb-2 text-lg font-semibold">AI 채팅</h3>
              <p className="text-prime-600 text-sm">
                AI와 대화하며 감정을 나누세요.
              </p>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="mt-12 flex gap-4">
            <button className="rounded-lg bg-cta-300 px-6 py-3 font-medium text-white hover:opacity-90 transition-opacity">
              시작하기
            </button>
            <button className="rounded-lg border border-cta-300 px-6 py-3 font-medium text-cta-300 hover:bg-cta-100/50 transition-colors">
              더 알아보기
            </button>
          </div>
        </div>

        {/* 개발 정보 */}
        <div className="mt-8 rounded-lg bg-neutral-100 p-4">
          <p className="text-prime-500 text-sm">
            💡 현재 Mock 모드로 실행 중입니다. 백엔드 API가 준비되면 .env.local에서 NEXT_PUBLIC_USE_MOCK=false로 변경하세요.
          </p>
        </div>
      </div>
    </main>
  );
}
