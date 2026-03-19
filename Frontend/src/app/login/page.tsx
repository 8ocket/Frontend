'use client';

import WaveBackground from '@/components/common/WaveBackground';
import { LoginContent, useAuth } from '@/features/auth';

export default function LoginPage() {
  const { isLoading, error, handleLogin } = useAuth();

  return (
    <main className="h-screen-safe relative w-full overflow-hidden bg-white dark:bg-prime-950">
      <WaveBackground />
      <div className="absolute inset-0 flex items-center justify-center overflow-y-auto px-4 py-8">
        <LoginContent onLogin={handleLogin} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}
