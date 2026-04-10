// src/features/auth/useOAuthCallback.ts
'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/entities/user/store';
import { useCreditStore } from '@/entities/credits/store';
import { getMyProfileApi } from '@/shared/api';
import { getMyCreditApi } from '@/entities/credits/api';
import { USE_MOCK } from '@/shared/lib/env';

interface OAuthLoginResult {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

interface UseOAuthCallbackOptions {
  loginApi: (code: string) => Promise<OAuthLoginResult>;
  errorMessage: string;
}

export function useOAuthCallback({ loginApi, errorMessage }: UseOAuthCallbackOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');
  const executed = useRef(false); // 중복 실행 방지
  const loginApiRef = useRef(loginApi);
  const errorMessageRef = useRef(errorMessage);

  useEffect(() => {
    const handleLogin = async () => {
      if (executed.current) return;
      executed.current = true;

      // ✅ non-null assertion 없이 타입 가드로 처리
      const code = initialCode ?? (USE_MOCK ? `mock_code_${Date.now()}` : null);
      if (!code) {
        router.push('/login');
        return;
      }

      try {
        const result = await loginApiRef.current(code);
        const { setTokens, setUser } = useAuthStore.getState();

        setTokens(result.accessToken, result.refreshToken);

        const [profileResult, creditResult] = await Promise.allSettled([
          getMyProfileApi(),
          getMyCreditApi(),
        ]);

        if (profileResult.status === 'rejected') {
          // 기존 유저는 프로필 조회 실패 시 에러 처리
          if (!result.isNewUser) throw profileResult.reason;
          // 신규 유저는 온보딩 전이라 프로필이 없을 수 있으므로 그대로 진행
        } else {
          const profile = profileResult.value;
          setUser({
            id: profile.user_id,
            name: profile.nickname,
            profileImage: profile.profile_image_url,
          });
        }

        if (creditResult.status === 'fulfilled') {
          useCreditStore.getState().setTotalCredit(creditResult.value.totalCredit);
        }

        if (result.isNewUser) {
          sessionStorage.setItem('pendingSignup', 'true');
        }
        router.push(result.isNewUser ? '/signup' : '/');
      } catch (error) {
        console.error(error);
        useAuthStore.getState().logout();
        router.push('/login?error=' + encodeURIComponent(errorMessageRef.current));
      }
    };

    handleLogin();
  }, [initialCode, router]);
}
