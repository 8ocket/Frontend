'use client';

import { IntroSection } from '@/components/about/IntroSection';
import { ChatDemoSection } from '@/components/about/ChatDemoSection';
import { SmallCardsSection } from '@/components/about/SmallCardsSection';
import { LargeCardSection } from '@/components/about/LargeCardSection';
import { FooterCTASection } from '@/components/about/FooterCTASection';

export default function AboutPage() {
  return (
    // 가로 스크롤 방지
    <div className="relative -mt-16 min-h-screen overflow-x-clip md:-mt-20">
      <main className="flex w-full flex-col items-center" style={{ gap: 'clamp(80px, 15vw, 320px)', paddingBottom: 0 }}>
        <IntroSection />
        <ChatDemoSection />
        <SmallCardsSection />
        <LargeCardSection />
        <FooterCTASection />
      </main>
    </div>
  );
}
