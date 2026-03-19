'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { kakaoLoginApi } from '@/shared/api';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');

  useEffect(() => {
    const handleLogin = async () => {
      // code 결정
      let resolvedCode: string | null = initialCode;

      if (!initialCode) {
        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
        if (USE_MOCK) {
          resolvedCode = `mock_code_${Date.now()}`;
        } else {
          router.push('/login');
          return;
        }
      }

      // 로그인 처리
      try {
        const result = await kakaoLoginApi(resolvedCode!);


        const login = useAuthStore.getState().login;
        login(
          { id: Date.now(), email: 'user@example.com', name: 'User', creditBalance: 0 },
          result.accessToken,
          result.refreshToken
        );

        // 신규 사용자면 회원가입, 기존 사용자면 홈으로
        router.push(result.isNewUser ? '/signup' : '/');
      } catch (error) {
        console.error('❌ Kakao login error:', error);
        router.push('/login');
      }
    };

    handleLogin();
  }, [initialCode, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}

export default function KakaoCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">로드 중...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
