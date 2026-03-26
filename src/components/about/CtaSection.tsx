'use client';

// Figma 2515:11384 — CtaSection
// Frame: 452×228px, VERTICAL, gap:40, counterAlign:CENTER
//
// TextBlock (2515:11385): 452×144px, VERTICAL, gap:40, CENTER
//   Title: 20px SemiBold #1A222E
//   Body:  16px Regular  #3F527E
//
// CTA Button (2515:11388): 452×44px
//   fills: r:0.510 g:0.788 b:1.0 → #82C8FF (cta-300)
//   padding: t:14 b:14 l:24 r:24
//   layoutMode: HORIZONTAL, primaryAxisAlignItems: CENTER
//   text: "로그인 하기" — 16px Medium(500)

import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export function CtaSection() {
  return (
    // 2515:11384 — 452×228px, VERTICAL, gap:40, counterAlign:CENTER
    <div className="flex flex-col items-center" style={{ width: 452, gap: 40 }}>

      {/* TextBlock 2515:11385 — 452×144px, VERTICAL, gap:40, CENTER */}
      <div className="flex flex-col items-center text-center" style={{ width: 452, gap: 40 }}>

        {/* Title — 20px SemiBold #1A222E */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: '130%',
            letterSpacing: '-0.015em',
            color: 'var(--color-prime-900)',
          }}
        >
          물처럼, 유연하게
        </h2>

        {/* Body — 16px Regular #3F527E */}
        <p
          className="body-1 whitespace-pre-line text-center text-prime-700"
        >
          {'감정을 억누르거나 부정하실 필요는 없어요.\n때로는 흘러가게 두고, 때로는 가만히 들여다보는 것만으로도 충분합니다.\n여러분의 마음이 제자리를 찾아갈 수 있도록, 저희가 함께하겠습니다.'}
        </p>
      </div>

      {/* CTA Button 2515:11388 — border-radius:8px, bg:cta-300(#82C9FF), text:prime-900 */}
      {/* size="default": rounded-lg(8px), text-prime-900 / hover:bg-[#4ba1f0] / active:bg-[#257cc0] */}
      <Button variant="primary" size="default" className="w-full" asChild>
        <Link href="/chat">AI 상담 시작하기</Link>
      </Button>
    </div>
  );
}
