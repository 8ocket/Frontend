'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/store';
import { socialLoginApi } from '@/shared/api';
import { getErrorMessage } from '@/shared/lib/utils/error';
import type { LoginProvider } from './LoginButton';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleLogin = async (provider: LoginProvider | 'temp') => {
    try {
      setIsLoading(true);
      setError(null);

      if (provider === 'temp') {
        const tempUser = {
          id: `temp_${Date.now()}`,
          email: `temp_user_${Date.now()}@mindlog.local`,
          name: `Temp User ${Math.floor(Math.random() * 1000)}`,
          creditBalance: 0,
        };
        const tempToken = `temp_token_${Date.now()}`;
        login(tempUser, tempToken, tempToken);
        router.push('/signup');
      } else {
        const response = await socialLoginApi(provider);
        if (!response || !response.user || !response.accessToken) {
          throw new Error('로그인 응답 데이터가 불완전합니다.');
        }
        const user = { ...response.user, id: String(response.user.id) };
        login(user, response.accessToken, response.refreshToken || '');
        router.push('/signup');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, '로그인에 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleLogin };
};
