'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let code = searchParams.get('code');

  useEffect(() => {
    // Mock 모드: code가 없으면 mock code 생성
    if (!code) {
      const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
      if (USE_MOCK) {
        code = `mock_code_${Date.now()}`;
        console.log('🎭 Mock mode: Generated mock code:', code);
      } else {
        // 실제 모드인데 code가 없으면 리다이렉트
        router.push('/login');
        return;
      }
    }

    const handleLogin = async () => {
      try {
        console.log('📡 Calling API: /api/v1/auth/login/kakao with code:', code?.substring(0, 20) + '...');
        
        const res = await fetch('/api/v1/auth/login/kakao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        console.log('📥 API Response status:', res.status);
        const result = await res.json();
        console.log('📥 API Response data:', result);

        if (res.ok) {
          // 1. 토큰 저장
          localStorage.setItem('accessToken', result.access_token);
          localStorage.setItem('refreshToken', result.refresh_token);
          console.log('✅ Tokens saved');

          // 2. 신규 유저 여부에 따른 분기 처리
          if (result.is_new_user) {
            console.log('🆕 New user → redirect to /signup/terms');
            router.push('/signup/terms');
          } else {
            console.log('👤 Existing user → redirect to /');
            router.push('/');
          }
        } else {
          console.error('❌ API Error:', result.error);
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
