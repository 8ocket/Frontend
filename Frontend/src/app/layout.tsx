import type { Metadata } from 'next';
import { Geist_Mono, Cormorant_Garamond } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { GNB } from '@/components/layout/gnb';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

// Pretendard 폰트 (system-ui fallback 사용)
const fontFamily =
  "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

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
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body
        className={`${geistMono.variable} ${cormorantGaramond.variable} antialiased`}
        style={{ fontFamily }}
      >
        <ThemeProvider>
          <QueryProvider>
            <GNB />
            <main className="pt-16 md:pt-20">{children}</main>
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
