'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      // TODO: 백엔드에서 토큰 전달 방식에 맞게 수정
      // 예시 1: 쿼리 파라미터로 받는 경우
      const accessToken = searchParams.get('accessToken') || searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');

      if (accessToken) {
        // TODO: 토큰으로 유저 정보 조회 API 호출
        // const { data } = await api.get('/auth/me');
        
        // 임시: 토큰만 저장하고 메인으로
        const mockUser = {
          id: 1,
          email: 'user@example.com',
          name: '사용자',
        };
        
        login(mockUser, accessToken, refreshToken || undefined);
        router.push('/');
      } else {
        // 토큰 없으면 로그인 페이지로
        router.push('/login');
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
