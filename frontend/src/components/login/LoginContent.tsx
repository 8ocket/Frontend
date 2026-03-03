'use client';

import { useState } from 'react';
import { LoginButton, type LoginProvider } from './LoginButton';
import { LogoSmall } from './LogoSmall';
import { loginTexts } from '@/constants/login';

interface LoginContentProps {
  onLogin?: (provider: LoginProvider) => Promise<void>;
}

export function LoginContent({ onLogin }: LoginContentProps) {
  const [loadingProvider, setLoadingProvider] = useState<LoginProvider | null>(null);

  const handleLogin = async (provider: LoginProvider) => {
    try {
      setLoadingProvider(provider);
      await onLogin?.(provider);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-8 sm:w-[420px] sm:px-8 sm:py-16 md:w-[450px]">
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

      <div className="space-y-3 sm:space-y-4">
        <LoginButton
          provider="kakao"
          onClick={() => handleLogin('kakao')}
          isLoading={loadingProvider === 'kakao'}
        />
        <LoginButton
          provider="naver"
          onClick={() => handleLogin('naver')}
          isLoading={loadingProvider === 'naver'}
        />
        <LoginButton
          provider="google"
          onClick={() => handleLogin('google')}
          isLoading={loadingProvider === 'google'}
        />

        <p className="text-center text-[10px] leading-[1.2] font-medium tracking-tight text-[#6983aa] sm:text-[11px] md:text-[12px]">
          {loginTexts.disclaimer}
        </p>
      </div>
    </div>
  );
}
