'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuroraBackground from '@/shared/ui/AuroraBackground';
import { LoginContent, useAuth } from '@/features/auth';

function LoginPageContent() {
  const { isLoading, error, handleLogin } = useAuth();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  return (
    <LoginContent onLogin={handleLogin} isLoading={isLoading} error={urlError || error} />
  );
}

export default function LoginPage() {
  return (
    <AuroraBackground>
      <Suspense>
        <LoginPageContent />
      </Suspense>
    </AuroraBackground>
  );
}
