'use client';

import { Suspense } from 'react';
import { useOAuthCallback } from '@/features/auth/useAuthCallback';
import { OAuthCallbackLoader } from '@/shared/ui/OAuthCallbackLoader';
import { kakaoLoginApi } from '@/entities/user';

function KakaoCallbackContent() {
  useOAuthCallback({
    loginApi: kakaoLoginApi,
    errorMessage: '카카오 로그인에 실패했습니다. 다시 시도해주세요.',
  });

  return <OAuthCallbackLoader message="카카오 로그인 처리 중입니다..." />;
}

export default function KakaoCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen-safe flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">로드 중...</p>
          </div>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
