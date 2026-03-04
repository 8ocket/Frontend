'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '@/components/common/WaveBackground';
import { useAuthStore } from '@/stores/auth';
import { socialLoginApi } from '@/lib/api';
import { LoginContent, type LoginProvider } from '@/components/login';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleLoginClick = async (provider: LoginProvider) => {
    console.log('Login attempt with provider:', provider);
    // 카카오만 처리
    if (provider !== 'kakao') return;

    try {
      setIsLoading(true);
      setError(null);

      // 소셜 로그인 API 호출
      const response = await socialLoginApi(provider);

      // 응답 데이터 검증
      if (!response || !response.user || !response.accessToken) {
        throw new Error('로그인 응답 데이터가 불완전합니다.');
      }

      // midleware에서 인증 상태를 확인하기 위해 쿠키와 localStorage에 토큰 저장
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=3600`;
      if (response.refreshToken) {
        document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=86400`;
      }

      // 로그인 성공 - 인증 상태 업데이트
      login(response.user, response.accessToken, response.refreshToken || '');

      // 로그인 완료 → signup 페이지로 이동
      router.push('/signup');
    } catch (err: unknown) {
      console.error('Login error:', err);

      let errorMessage = '로그인에 실패했습니다.';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Axios 에러 처리
        if ('response' in err) {
          const apiError = err as { response?: { data?: { error?: { message?: string } } } };
          errorMessage = apiError.response?.data?.error?.message || errorMessage;
        }
        // 기타 객체 에러
        if ('message' in err) {
          errorMessage = (err as { message: string }).message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-white">
      <WaveBackground />
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <LoginContent onLogin={handleLoginClick} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}
