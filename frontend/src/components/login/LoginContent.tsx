'use client';

import { useState } from 'react';
import { LoginButton, type LoginProvider } from './LoginButton';
import { LogoSmall } from './LogoSmall';
import { loginTexts, oauthConfig } from '@/constants/login';

interface LoginContentProps {
  onLogin?: (provider: LoginProvider) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function LoginContent({
  onLogin,
  isLoading: externalLoading,
  error: externalError,
}: LoginContentProps) {
  const [loadingProvider, setLoadingProvider] = useState<LoginProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (provider: LoginProvider) => {
    try {
      setLoadingProvider(provider);
      setError(null);

      if (provider === 'kakao' && !USE_MOCK) {
        // 실제 카카오 인증 (Mock 모드가 아닐 때만)
        const params = new URLSearchParams({
          client_id: oauthConfig.kakao.clientId,
          redirect_uri: oauthConfig.kakao.redirectUri,
          response_type: 'code',
        });

        const kakaoAuthUrl = `${oauthConfig.kakao.authUrl}?${params.toString()}`;
        window.location.href = kakaoAuthUrl;
      } else {
        // Mock 모드 또는 다른 프로바이더 처리
        await onLogin?.(provider);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
      setError(message);
      console.error('Login error:', err);
    } finally {
      setLoadingProvider(null);
    }
  };

  const displayError = externalError || error;
  const isLoading = externalLoading || loadingProvider !== null;

  return (
    <div className="absolute top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 px-4 py-8 sm:w-[420px] sm:px-8 sm:py-16 md:w-[450px]">
      <div className="mb-8 flex justify-center sm:mb-16">
        <LogoSmall className="h-[180px] w-[180px] sm:h-[240px] sm:w-[240px] md:h-[295px] md:w-[295px]" />
      </div>

      <div className="mb-4 space-y-3 text-center sm:mb-6 sm:space-y-4">
        <p className="text-[13px] leading-[1.3] font-semibold tracking-tight text-[#1a222e] sm:text-[14px] md:text-[16px]">
          {loginTexts.greeting}
        </p>
        <h1 className="text-[16px] leading-[1.3] font-semibold tracking-tight text-[#1a222e] sm:text-[18px] md:text-[20px]">
          {loginTexts.loginPrompt}
        </h1>
      </div>

      {displayError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{displayError}</div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <LoginButton
          provider="kakao"
          onClick={() => handleLogin('kakao')}
          isLoading={loadingProvider === 'kakao'}
          disabled={isLoading}
        />
        <LoginButton
          provider="naver"
          onClick={() => handleLogin('naver')}
          isLoading={loadingProvider === 'naver'}
          disabled={isLoading}
        />
        <LoginButton
          provider="google"
          onClick={() => handleLogin('google')}
          isLoading={loadingProvider === 'google'}
          disabled={isLoading}
        />

        <p className="text-center text-[10px] leading-[1.2] font-medium tracking-tight text-[#6983aa] sm:text-[11px] md:text-[12px]">
          {loginTexts.disclaimer}
        </p>
      </div>
    </div>
  );
}
