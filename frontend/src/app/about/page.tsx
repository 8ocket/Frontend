'use client';

import { GNB } from '@/components/layout/gnb';

export default function AboutPage() {
  return (
    <div className="dark:bg-prime-900 min-h-screen bg-white">
      <GNB />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-prime-900 text-4xl font-bold dark:text-white">브랜드 소개</h1>
      </main>
    </div>
  );
}
