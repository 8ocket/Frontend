'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const handleLogin = async () => {
      // code 결정
      let resolvedCode: string | null = initialCode;

      if (!initialCode) {
        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
        if (USE_MOCK) {
          resolvedCode = `mock_code_${Date.now()}`;
          console.log('🎭 Mock mode: Generated mock code:', resolvedCode);
        } else {
          router.push('/login');
          return;
        }
      }

      // 로그인 처리
      try {
        const res = await fetch('/api/v1/auth/login/kakao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: resolvedCode }),
        });

        const result = await res.json();

        if (res.ok) {
          document.cookie = `accessToken=${result.access_token}; path=/; max-age=3600`;
          document.cookie = `refreshToken=${result.refresh_token}; path=/; max-age=86400`;
          localStorage.setItem('accessToken', result.access_token);
          localStorage.setItem('refreshToken', result.refresh_token);

          const login = useAuthStore.getState().login;
          login(
            { id: Date.now(), email: 'user@example.com', name: 'User' },
            result.access_token,
            result.refresh_token
          );

          router.push('/signup');
        } else {
          alert('로그인에 실패했습니다.');
          router.push('/login');
        }
      } catch (error) {
        console.error('❌ Kakao login error:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
        router.push('/login');
      }
    };

    handleLogin();
  }, [initialCode, router]); // ← 의존성도 깔끔해짐

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}
