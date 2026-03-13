'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { googleLoginApi } from '@/lib/api';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');

  useEffect(() => {
    const handleLogin = async () => {
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

      try {
        const result = await googleLoginApi(resolvedCode!);

        document.cookie = `accessToken=${result.accessToken}; path=/; max-age=3600`;
        document.cookie = `refreshToken=${result.refreshToken}; path=/; max-age=86400`;
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);

        const login = useAuthStore.getState().login;
        login(
          { id: Date.now(), email: 'user@example.com', name: 'User' },
          result.accessToken,
          result.refreshToken
        );

        router.push(result.isNewUser ? '/signup' : '/');
      } catch (error) {
        console.error('❌ Google login error:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
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

export default function GoogleCallback() {
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
      <GoogleCallbackContent />
    </Suspense>
  );
}
