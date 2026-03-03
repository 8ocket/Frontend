'use client';

import { useRouter } from 'next/navigation';
import { LoginContent, ModeSelect } from '@/components/login';
import WaveBackground from '@/components/login/WaveBackground';
import type { LoginProvider } from '@/components/login';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (provider: LoginProvider) => {
    try {
      // TODO: 실제 로그인 로직 구현
      console.log(`Login with ${provider}`);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleModeSelect = () => {
    // TODO: 다크 모드 토글 로직 구현
    console.log('Toggle dark mode');
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-white">
      <WaveBackground />
      <LoginContent onLogin={handleLogin} />
      <ModeSelect onClick={handleModeSelect} className="fixed top-10 right-10 z-20" />
    </main>
  );
}
