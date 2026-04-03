// src/features/auth/useOAuthCallback.ts
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/entities/user/store';
import { useCreditStore } from '@/entities/credits/store';
import { getMyProfileApi } from '@/shared/api';
import { getMyCreditApi } from '@/entities/credits/api';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

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

  useEffect(() => {
    const handleLogin = async () => {
      // ✅ non-null assertion 없이 타입 가드로 처리
      const code = initialCode ?? (USE_MOCK ? `mock_code_${Date.now()}` : null);
      if (!code) {
        router.push('/login');
        return;
      }

      try {
        const result = await loginApi(code);
        const { setTokens, setUser } = useAuthStore.getState();

        setTokens(result.accessToken, result.refreshToken);

        const [profile, credit] = await Promise.all([getMyProfileApi(), getMyCreditApi()]);
        setUser({
          id: profile.user_id,
          email: '',
          name: profile.nickname,
          profileImage: profile.profile_image_url,
        });
        useCreditStore.getState().setTotalCredit(credit.totalCredit);

        router.push(result.isNewUser ? '/signup' : '/');
      } catch (error) {
        console.error(error);
        router.push(`/login?error=${errorMessage}`);
      }
    };

    handleLogin();
  }, [initialCode, router, loginApi, errorMessage]);
}
