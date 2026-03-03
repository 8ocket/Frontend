'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/axios';
import type { LoginResponse } from '@/types/login';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam) {
          const message = errorDescription || '로그인이 취소되었습니다.';
          setError(message);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (!code) {
          setError('인가 코드를 받지 못했습니다.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        const response = await api.post<LoginResponse>('/v1/auth/login/kakao', { code });
        const { accessToken, refreshToken, user } = response.data;

        login({ ...user, id: Number(user.id) }, accessToken, refreshToken);
        router.push('/');
      } catch (err) {
        const message = err instanceof Error ? err.message : '로그인 처리 중 오류가 발생했습니다.';
        setError(message);
        console.error('Callback error:', err);
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">로그인 오류</h1>
          <p className="mb-6 text-red-500">{error}</p>
          <p className="text-sm text-gray-600">3초 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
