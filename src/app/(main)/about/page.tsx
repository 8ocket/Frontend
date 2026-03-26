'use client';

// Figma 2194:11570 — 브랜드 소개 페이지 최적화 버전
// 페이지 배경: #F8FAFC
// 구조: 각 섹션 컴포넌트가 스스로의 배경(Full Width)과 콘텐츠(1077px)를 관리하도록 변경

import { IntroSection } from '@/components/about/IntroSection';
import { ChatDemoSection } from '@/components/about/ChatDemoSection';
import { SmallCardsSection } from '@/components/about/SmallCardsSection';
import { LargeCardSection } from '@/components/about/LargeCardSection';
import { FooterCTASection } from '@/components/about/FooterCTASection';

export default function AboutPage() {
  return (
    // 1. 가로 스크롤 방지를 위해 overflow-x-hidden을 추가합니다.
    <div
      className="relative -mt-16 min-h-screen overflow-x-hidden md:-mt-20"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      {/* 기존의 'absolute' 배경 레이어들을 모두 삭제했습니다. 
         이제 IntroSection과 FooterCTASection 내부에서 개별적으로 배경을 렌더링합니다. 
      */}

      {/* 2. main의 고정 너비(1077px)를 제거하고 w-full로 설정하여 섹션들이 너비를 꽉 채울 수 있게 합니다. */}
      <main className="flex w-full flex-col items-center" style={{ gap: 320, paddingBottom: 160 }}>
        {/* IntroSection: 내부에 꽉 찬 배경 이미지와 펄스 애니메이션이 포함됨 */}
        <IntroSection />

        {/* 나머지 섹션들: 각각 내부에서 max-w-[1077px] mx-auto 구조를 가져야 합니다. */}
        <ChatDemoSection />
        <SmallCardsSection />
        <LargeCardSection />
        <FooterCTASection />
      </main>
    </div>
  );
}
