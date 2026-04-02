'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/entities/user/store';
import { useCreditStore } from '@/entities/credits/store';
import { getMyCreditApi } from '@/entities/credits/api';
import { kakaoLoginApi, getMyProfileApi } from '@/shared/api';

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


        const { login, setUser } = useAuthStore.getState();

        // 토큰 쿠키 저장
        login(
          { id: '', email: '', name: '' },
          result.accessToken,
          result.refreshToken
        );

        // 실제 프로필 조회 후 유저 상태 업데이트
        const [profile, credit] = await Promise.all([getMyProfileApi(), getMyCreditApi()]);
        setUser({
          id: profile.user_id,
          email: '',
          name: profile.nickname,
          profileImage: profile.profile_image_url,
        });
        useCreditStore.getState().setTotalCredit(credit.totalCredit);

        // 신규 사용자면 회원가입, 기존 사용자면 홈으로
        router.push(result.isNewUser ? '/signup' : '/');
      } catch (error) {
        console.error('❌ Kakao login error:', error);
        router.push('/login?error=카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    };

    handleLogin();
  }, [initialCode, router]);

  return (
    <div className="flex min-h-screen-safe items-center justify-center">
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
        <div className="flex min-h-screen-safe items-center justify-center">
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
