'use client';

// Figma 2515:11371 — SmallCardsSection
// Frame: 605×484px, VERTICAL, gap:40, counterAlign:CENTER
//
// TextBlock (2515:11372): 551×144px, VERTICAL, gap:40, CENTER
//   Title: 20px SemiBold #1A222E
//   Body:  16px Regular  #3F527E
//
// CardRow (2515:11375): 605×300px, HORIZONTAL, gap:40, counterAlign:CENTER
//   3 CARD TEMPLATES INSTANCE — 각 175×300px
//   Card 1: JOY   (CARD TEXT "JOY")
//   Card 2: TRUST (CARD TEXT "TRUST")
//   Card 3: SADNESS (CARD TEXT "SADNESS")

import { EmotionCard } from '@/components/emotion/EmotionCard';
import type { EmotionCardData } from '@/entities/emotion';

// Figma 확인 — JOY / TRUST / SADNESS 3개 카드 (2515:11376 ~ 2515:11378)
const SAMPLE_CARDS: EmotionCardData[] = [
  {
    cardId: 'about-joy',
    sessionId: 'about-sample',
    layers: [
      { type: 'joy', role: 'primary', opacity: 1.0, blur: 20 },
      { type: 'joy', role: 'secondary', opacity: 0.6, blur: 40 },
      { type: 'joy', role: 'background', opacity: 0.3, blur: 60 },
    ],
    keywords: [{ keyword: '기쁨', emotionType: 'joy', percentage: 80 }],
    summary: { title: 'JOY', description: '기쁨의 감정' },
    fact: null,
    emotion: null,
    insight: null,
    createdAt: null,
  },
  {
    cardId: 'about-trust',
    sessionId: 'about-sample',
    layers: [
      { type: 'trust', role: 'primary', opacity: 1.0, blur: 20 },
      { type: 'trust', role: 'secondary', opacity: 0.6, blur: 40 },
      { type: 'trust', role: 'background', opacity: 0.3, blur: 60 },
    ],
    keywords: [{ keyword: '신뢰', emotionType: 'trust', percentage: 80 }],
    summary: { title: 'TRUST', description: '신뢰의 감정' },
    fact: null,
    emotion: null,
    insight: null,
    createdAt: null,
  },
  {
    cardId: 'about-sadness',
    sessionId: 'about-sample',
    layers: [
      { type: 'sadness', role: 'primary', opacity: 1.0, blur: 20 },
      { type: 'sadness', role: 'secondary', opacity: 0.6, blur: 40 },
      { type: 'sadness', role: 'background', opacity: 0.3, blur: 60 },
    ],
    keywords: [{ keyword: '슬픔', emotionType: 'sadness', percentage: 80 }],
    summary: { title: 'SADNESS', description: '슬픔의 감정' },
    fact: null,
    emotion: null,
    insight: null,
    createdAt: null,
  },
];

export function SmallCardsSection() {
  return (
    // 2515:11371 — 605×484px, VERTICAL, gap:40, counterAlign:CENTER
    <div className="flex flex-col items-center" style={{ width: 605, gap: 40 }}>

      {/* TextBlock 2515:11372 — 551×144px, VERTICAL, gap:40, CENTER */}
      <div className="flex flex-col items-center text-center" style={{ width: 551, gap: 40 }}>

        {/* Title — 20px SemiBold #1A222E */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: '130%',
            letterSpacing: '-0.015em',
            color: '#1A222E',
          }}
        >
          여러분의 마음을 있는 그대로 바라보세요
        </h2>

        {/* Body — 16px Regular #3F527E */}
        <p
          className="body-1 whitespace-pre-line text-center"
          style={{ color: '#3F527E' }}
        >
          {'감정은 억누른다고 사라지지 않아요.\n다만 제대로 바라보지 못하면, 어느새 쌓이고 굳어버리기도 하죠.\n지금 여러분의 감정이 어디서 왔는지, 어떻게 흘러가고 있는지, 함께 들여다보고 싶습니다.'}
        </p>
      </div>

      {/* CardRow 2515:11375 — 605×300px, HORIZONTAL, gap:40, counterAlign:CENTER */}
      {/* CARD TEMPLATES: 각 175×300px (width prop 사용) */}
      <div className="flex flex-row items-center" style={{ gap: 40 }}>
        {SAMPLE_CARDS.map((card) => (
          <EmotionCard
            key={card.cardId}
            data={card}
            width={175}
            labelOverride={card.summary?.title}
          />
        ))}
      </div>
    </div>
  );
}
