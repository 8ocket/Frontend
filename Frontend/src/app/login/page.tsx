'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '@/components/common/WaveBackground';
import { useAuthStore } from '@/stores/auth';
import { socialLoginApi } from '@/lib/api';
import { LoginContent, type LoginProvider } from '@/components/login';
import { getErrorMessage } from '@/lib/utils/error';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleLoginClick = async (provider: LoginProvider | 'temp') => {
    try {
      setIsLoading(true);
      setError(null);

      // 임시 로그인 처리
      if (provider === 'temp') {
        // 임시 사용자 데이터 생성
        const tempUser = {
          id: Math.floor(Math.random() * 10000),
          email: `temp_user_${Date.now()}@mindlog.local`,
          name: `Temp User ${Math.floor(Math.random() * 1000)}`,
          creditBalance: 0,
        };

        const tempToken = `temp_token_${Date.now()}`;

        login(tempUser, tempToken, tempToken);

        // 로그인 완료 → signup 페이지로 이동
        router.push('/signup');
      } else {
        // 다른 프로바이더는 소셜 로그인 API 호출
        const response = await socialLoginApi(provider);

        // 응답 데이터 검증
        if (!response || !response.user || !response.accessToken) {
          throw new Error('로그인 응답 데이터가 불완전합니다.');
        }

        login(response.user, response.accessToken, response.refreshToken || '');

        // 로그인 완료 → signup 페이지로 이동
        router.push('/signup');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, '로그인에 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen-safe relative w-full overflow-hidden bg-white dark:bg-prime-950">
      <WaveBackground />
      <div className="absolute inset-0 flex items-center justify-center overflow-y-auto px-4 py-8">
        <LoginContent onLogin={handleLoginClick} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}
