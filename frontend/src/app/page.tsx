'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { getSessionsApi } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, setLoading } = useAuthStore();

  useEffect(() => {
    // 인증 상태 확인
    const token = localStorage.getItem('accessToken');

    // 토큰이 없으면 로그인 페이지로
    if (!token) {
      setLoading(false);
      router.push('/login');
      return;
    }

    // 토큰이 있는데 store에 사용자 정보가 없으면 동기화
    if (token && !user) {
      const login = useAuthStore.getState().login;
      const mockUser = {
        id: Date.now(),
        email: 'user@example.com',
        name: 'User',
      };
      login(mockUser, token, localStorage.getItem('refreshToken') || '');
    } else {
      // 토큰이 있고 user가 있으면 로딩 완료
      setLoading(false);
    }
  }, []); // 의존성 배열을 비움 - 한 번만 실행

  if (authLoading || !isAuthenticated) {
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
    <div className="dark:bg-prime-900 min-h-screen bg-white">
      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 환영 섹션 */}
        <section className="mb-16">
          <div className="dark:border-prime-800 from-secondary-100 dark:from-prime-800 dark:to-prime-700 rounded-2xl border border-neutral-200 bg-gradient-to-br to-blue-50 p-8 sm:p-12">
            <h1 className="text-prime-900 mb-4 text-4xl font-bold sm:text-5xl dark:text-white">
              마인드 로그에 오신 것을 환영합니다! 🎉
            </h1>
            <p className="text-prime-600 mb-8 max-w-2xl text-lg sm:text-xl dark:text-neutral-300">
              당신의 마음을 기록하고, 감정을 추적하며, AI와 함께 성장하세요.
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => router.push('/collection')}
                className="bg-cta-300 hover:bg-cta-400 rounded-lg px-6 py-3 font-semibold text-white shadow-md transition-colors hover:shadow-lg"
              >
                마음 기록하기
              </button>
              <button
                onClick={() => router.push('/chat')}
                className="border-cta-300 hover:bg-cta-100/10 text-cta-300 dark:text-cta-200 rounded-lg border-2 px-6 py-3 font-semibold transition-colors"
              >
                AI 상담 받기
              </button>
            </div>
          </div>
        </section>

        {/* 주요 기능 카드 섹션 */}
        <section className="mb-16">
          <h2 className="text-prime-900 mb-8 text-3xl font-bold dark:text-white">주요 기능</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* 일기 작성 카드 */}
            <div
              className="group dark:border-prime-700 dark:bg-prime-800 hover:border-cta-300 cursor-pointer rounded-xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg"
              onClick={() => router.push('/collection')}
            >
              <div className="mb-4 text-5xl transition-transform group-hover:scale-110">📔</div>
              <h3 className="text-prime-900 mb-3 text-xl font-bold dark:text-white">일기 작성</h3>
              <p className="text-prime-600 text-sm leading-relaxed dark:text-neutral-400">
                매일의 감정과 생각을 자유롭게 기록하세요. 당신의 마음의 목소리를 들어보세요.
              </p>
            </div>

            {/* 감정 분석 카드 */}
            <div
              className="group dark:border-prime-700 dark:bg-prime-800 hover:border-cta-300 cursor-pointer rounded-xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg"
              onClick={() => router.push('/report')}
            >
              <div className="mb-4 text-5xl transition-transform group-hover:scale-110">📊</div>
              <h3 className="text-prime-900 mb-3 text-xl font-bold dark:text-white">감정 분석</h3>
              <p className="text-prime-600 text-sm leading-relaxed dark:text-neutral-400">
                시간에 따른 감정 변화를 시각화하고 인사이트를 얻으세요.
              </p>
            </div>

            {/* AI 상담 카드 */}
            <div
              className="group dark:border-prime-700 dark:bg-prime-800 hover:border-cta-300 cursor-pointer rounded-xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg"
              onClick={() => router.push('/chat')}
            >
              <div className="mb-4 text-5xl transition-transform group-hover:scale-110">💬</div>
              <h3 className="text-prime-900 mb-3 text-xl font-bold dark:text-white">AI 상담</h3>
              <p className="text-prime-600 text-sm leading-relaxed dark:text-neutral-400">
                전문가 수준의 AI와 대화하며 감정을 나누고 조언을 받으세요.
              </p>
            </div>
          </div>
        </section>

        {/* 최근 활동 섹션 */}
        <section className="mb-16">
          <h2 className="text-prime-900 mb-8 text-3xl font-bold dark:text-white">최근 활동</h2>
          <div className="dark:border-prime-700 dark:bg-prime-800 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="p-8 text-center">
              <p className="text-prime-600 mb-4 dark:text-neutral-400">
                아직 기록된 활동이 없습니다.
              </p>
              <button
                onClick={() => router.push('/collection')}
                className="bg-cta-300/10 hover:bg-cta-300/20 text-cta-300 inline-block rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                첫 번째 기록 만들기
              </button>
            </div>
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="mb-16">
          <h2 className="text-prime-900 mb-8 text-3xl font-bold dark:text-white">나의 통계</h2>
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { label: '총 기록', value: '0', icon: '📝' },
              { label: '연속 기록', value: '0일', icon: '🔥' },
              { label: '평균 감정도', value: '-', icon: '😊' },
              { label: '이번 주 활동', value: '0회', icon: '📅' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="dark:border-prime-700 dark:bg-prime-800 rounded-lg border border-neutral-200 bg-white p-6 text-center"
              >
                <div className="mb-2 text-4xl">{stat.icon}</div>
                <p className="text-prime-600 mb-2 text-sm dark:text-neutral-400">{stat.label}</p>
                <p className="text-prime-900 text-2xl font-bold dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 정보 배너 */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            💡 <strong>Mock 모드 실행 중:</strong> 백엔드 API가 준비되면 .env.local에서
            NEXT_PUBLIC_USE_MOCK=false로 변경하세요.
          </p>
          {/* TODO: 테스트 완료 후 삭제 */}
          <button
            onClick={async () => {
              const result = await getSessionsApi({ status: 'saved' });
              console.log('[getSessionsApi 테스트]', result);
              alert(JSON.stringify(result, null, 2));
            }}
            className="mt-2 rounded bg-blue-200 px-3 py-1 text-xs text-blue-900 hover:bg-blue-300"
          >
            getSessionsApi 테스트
          </button>
        </div>
      </main>
    </div>
  );
}
