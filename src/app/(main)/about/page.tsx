'use client';

// Figma 2194:11570 — 브랜드 소개 페이지
// 페이지 배경: #F8FAFC (fills r:0.9725 g:0.9804 b:0.9882)
// 콘텐츠 컨테이너: 1077px centered, VERTICAL, gap:320

import { IntroSection } from '@/components/about/IntroSection';
import { ChatDemoSection } from '@/components/about/ChatDemoSection';
import { PersonaSection } from '@/components/about/PersonaSection';
import { SmallCardsSection } from '@/components/about/SmallCardsSection';
import { LargeCardSection } from '@/components/about/LargeCardSection';
import { CtaSection } from '@/components/about/CtaSection';

export default function AboutPage() {
  return (
    <div
      className="-mt-16 md:-mt-20"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage: "url('/images/backgrounds/unsplash_1DwI4LgorCc.png')",
        backgroundSize: '100% 90vh',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 메인 콘텐츠 — 2515:11312, 1077px, VERTICAL gap:320, counterAlign:CENTER */}
      <main
        className="mx-auto flex flex-col items-center"
        style={{ width: 1077, gap: 320, paddingTop: 80, paddingBottom: 80 }}
      >
        <IntroSection />
        <ChatDemoSection />
        <PersonaSection />
        <SmallCardsSection />
        <LargeCardSection />
        <CtaSection />
      </main>
    </div>
  );
}
