import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthInitializer } from '@/shared/ui/AuthInitializer';
import { ToastProvider } from '@/shared/ui/toast';
import { FooterWrapper } from '@/widgets/gnb';
import './globals.css';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'MindLog',
  description: 'MindLog - 마음을 기록하다',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.variable} ${cormorantGaramond.variable} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              {/* persisted user와 실제 쿠키 상태가 어긋난 경우를 앱 시작 시 한 번 정리합니다. */}
              <AuthInitializer />
              <div className="flex min-h-dvh flex-col">
                {children}
                <FooterWrapper />
              </div>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
