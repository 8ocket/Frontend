'use client';

import AuroraBackground from '@/shared/ui/AuroraBackground';
import { LoginContent, useAuth } from '@/features/auth';

export default function LoginPage() {
  const { isLoading, error, handleLogin } = useAuth();

  return (
    <AuroraBackground>
      <LoginContent onLogin={handleLogin} isLoading={isLoading} error={error} />
    </AuroraBackground>
  );
}
