'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginContent, Conditions } from '@/components/login';
import WaveBackground from '@/components/common/WaveBackground';
import { useAuthStore } from '@/stores/auth';
import { socialLoginApi } from '@/lib/api';
import type { LoginProvider } from '@/components/login';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConditions, setShowConditions] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<LoginProvider | null>(null);
  const { login } = useAuthStore();

  const handleLoginClick = (provider: LoginProvider) => {
    // 약관에 동의하지 않았으면 모달 표시
    setShowConditions(true);
    setPendingProvider(provider);
  };

  const handleConditionsAgree = async () => {
    if (!pendingProvider) return;

    try {
      setIsLoading(true);
      setError(null);

      // 소셜 로그인 API 호출
      const response = await socialLoginApi(pendingProvider);

      // 로그인 성공 - 인증 상태 업데이트
      login(response.user, response.accessToken, response.refreshToken);

      // 메인 페이지로 이동
      router.push('/');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.message ||
        `${pendingProvider} 로그인에 실패했습니다.`;
      setError(errorMessage);
      console.error('Login failed:', err);
      setShowConditions(false);
      setPendingProvider(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConditionsClose = () => {
    setShowConditions(false);
    setPendingProvider(null);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-white">
      <WaveBackground />
      <LoginContent onLogin={handleLoginClick} isLoading={isLoading} error={error} />

      {/* 약관 동의 모달 */}
      <Conditions
        isOpen={showConditions}
        onClose={handleConditionsClose}
        onAgree={handleConditionsAgree}
      />
    </main>
  );
}
