import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/shared/ui/toast';
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
      <body
        className={`${pretendard.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
