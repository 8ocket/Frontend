'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) return;

    const handleLogin = async () => {
      try {
        const res = await fetch('/api/v1/auth/login/kakao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const result = await res.json();

        if (res.ok) {
          // 1. 토큰 저장
          localStorage.setItem('accessToken', result.access_token);
          localStorage.setItem('refreshToken', result.refresh_token);

          // 2. 신규 유저 여부에 따른 분기 처리
          if (result.is_new_user) {
            // 신규 사용자 -> 가입 정보 입력 페이지로 이동
            router.push('/signup/terms');
          } else {
            // 기존 사용자 -> 홈으로 이동
            router.push('/');
          }
        } else {
          alert('로그인에 실패했습니다.');
          router.push('/login');
        }
      } catch (error) {
        console.error('Kakao login error:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
        router.push('/login');
      }
    };

    handleLogin();
  }, [code, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}
