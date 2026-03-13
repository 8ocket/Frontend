'use client';

import { useState } from 'react';
import { LoginButton, type LoginProvider } from './LoginButton';
import { LogoSmall } from './LogoSmall';
import { loginTexts, oauthConfig } from '@/constants/login';
import { getErrorMessage } from '@/lib/utils/error';

interface LoginContentProps {
  onLogin?: (provider: LoginProvider | 'temp') => Promise<void>;
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

      if (provider === 'kakao') {
        if (USE_MOCK) {
          window.location.href = '/auth/callback';
        } else {
          const params = new URLSearchParams({
            client_id: oauthConfig.kakao.clientId,
            redirect_uri: oauthConfig.kakao.redirectUri,
            response_type: 'code',
          });
          window.location.href = `${oauthConfig.kakao.authUrl}?${params.toString()}`;
        }
      } else if (provider === 'google') {
        if (USE_MOCK) {
          window.location.href = '/auth/google/callback';
        } else {
          const params = new URLSearchParams({
            client_id: oauthConfig.google.clientId,
            redirect_uri: oauthConfig.google.redirectUri,
            response_type: 'code',
            scope: 'email profile',
          });
          window.location.href = `${oauthConfig.google.authUrl}?${params.toString()}`;
        }
      } else {
        // 다른 프로바이더 처리
        await onLogin?.(provider);
      }
    } catch (err) {
      setError(getErrorMessage(err, '로그인 중 오류가 발생했습니다.'));
    } finally {
      setLoadingProvider(null);
    }
  };

  const displayError = externalError || error;
  const isLoading = externalLoading || loadingProvider !== null;

  return (
    <div className="flex w-96 flex-col items-center justify-center">
      {/* 로고 */}
      <LogoSmall className="h-73.75 w-73.75" />
      {/* 텍스트 섹션 */}
      <div className="mt-16 flex w-full flex-col items-center gap-4">
        <p className="text-center text-sm leading-[1.3] font-semibold text-[#1a222e]">
          {loginTexts.greeting}
        </p>
        <h1 className="text-center text-xl leading-[1.3] font-semibold text-[#1a222e]">
          {loginTexts.loginPrompt}
        </h1>
      </div>

      {/* 로그인 버튼 섹션 */}
      <div className="mt-6 flex w-full flex-col items-stretch gap-4">
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

        {/* 임시 로그인 버튼 */}
        <button
          onClick={async () => {
            setLoadingProvider('kakao');
            try {
              await onLogin?.('temp');
            } catch (err) {
              setError(getErrorMessage(err, '임시 로그인 중 오류가 발생했습니다.'));
            } finally {
              setLoadingProvider(null);
            }
          }}
          disabled={isLoading}
          className="rounded-lg bg-gray-400 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingProvider === 'kakao' ? '로그인 중...' : '임시 로그인 (개발용)'}
        </button>

        {/* 디스클레이머 텍스트 */}
        <p className="text-prime-500 text-center text-xs leading-[1.2] font-medium whitespace-pre-wrap">
          {loginTexts.disclaimer}
        </p>
      </div>

      {/* 에러 메시지 */}
      {displayError && (
        <div className="w-full rounded-lg bg-red-50 p-3 text-sm text-red-600">{displayError}</div>
      )}
    </div>
  );
}
