'use client';

import { useState } from 'react';
import { LoginButton, type LoginProvider } from './LoginButton';
import { LogoSmall } from './LogoSmall';
import { loginTexts, oauthConfig } from '@/constants/login';
import { getErrorMessage } from '@/shared/lib/utils/error';
import { USE_MOCK } from '@/shared/lib/env';

interface LoginContentProps {
  onLogin?: (provider: LoginProvider | 'temp') => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginContent({
  onLogin,
  isLoading: externalLoading,
  error: externalError,
}: LoginContentProps) {
  const [loadingProvider, setLoadingProvider] = useState<LoginProvider | 'temp' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (provider: LoginProvider) => {
    try {
      setLoadingProvider(provider);
      setError(null);

      if (provider === 'kakao') {
        if (USE_MOCK) {
          window.location.href = '/auth/kakao/callback';
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
    <div className="relative flex w-full max-w-142 flex-col items-center">
      {/* 카드 */}
      <div className="w-full rounded-2xl border border-white/40 bg-white/70 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md">
        {/* 로고 — 카드 안 상단 중앙 */}
        <div className="mb-8 flex justify-center">
          <LogoSmall className="h-24 w-24" />
        </div>

        {/* 텍스트 섹션 */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-center text-[16px] leading-[1.3] font-semibold tracking-[-0.24px] text-[#1a222e]">
            {loginTexts.greeting}
          </p>
          <h1 className="text-center text-[20px] leading-[1.3] font-semibold tracking-[-0.3px] text-[#1a222e]">
            {loginTexts.loginPrompt}
          </h1>
        </div>

        {/* 로그인 버튼 섹션 */}
        <div className="mt-8 flex w-full flex-col items-stretch gap-4.5">
          <LoginButton
            provider="kakao"
            onClick={() => handleLogin('kakao')}
            isLoading={loadingProvider === 'kakao'}
            disabled={isLoading}
          />
          {/* 네이버 로그인 — 미연동, 추후 활성화
          <LoginButton
            provider="naver"
            onClick={() => handleLogin('naver')}
            isLoading={loadingProvider === 'naver'}
            disabled={isLoading}
          /> */}
          <LoginButton
            provider="google"
            onClick={() => handleLogin('google')}
            isLoading={loadingProvider === 'google'}
            disabled={isLoading}
          />

          {/* 임시 로그인 버튼 — 개발 환경에서만 노출 */}
          {USE_MOCK && (
            <button
              onClick={async () => {
                setLoadingProvider('temp');
                try {
                  await onLogin?.('temp');
                } catch (err) {
                  setError(getErrorMessage(err, '임시 로그인 중 오류가 발생했습니다.'));
                } finally {
                  setLoadingProvider(null);
                }
              }}
              disabled={isLoading}
              className="rounded-xl bg-gray-400 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingProvider === 'temp' ? '로그인 중...' : '임시 로그인 (개발용)'}
            </button>
          )}

          {/* 디스클레이머 텍스트 */}
          <p className="text-center text-[12px] leading-[1.2] tracking-[-0.18px] text-[#6a7282]">
            {loginTexts.disclaimer}
          </p>
        </div>

        {/* 에러 메시지 */}
        {displayError && (
          <div className="mt-4 w-full rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {displayError}
          </div>
        )}
      </div>
    </div>
  );
}
