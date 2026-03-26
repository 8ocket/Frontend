'use client';

// Figma 2515:11379 — LargeCardSection
// Frame: 527×784px, VERTICAL, gap:40, counterAlign:CENTER
//
// TextBlock (2515:11380): 527×144px, VERTICAL, gap:40, CENTER
//   Title: 20px SemiBold #1A222E
//   Body:  16px Regular  #3F527E
//
// Card Sample (2515:11383): 350×600px, fills:#F8FAFC
//   → EmotionCard size="sample" (350×600px 프리셋)

import { EmotionCardBack } from '@/widgets/emotion-card';
import type { EmotionCardData } from '@/entities/emotion';

// Figma 2515:11383 "Card sample" — 350×600px
const CARD_DATA: EmotionCardData = {
  cardId: 'about-large-card',
  sessionId: 'about-sample',
  layers: [
    { type: 'joy', role: 'primary',    opacity: 0.6, blur: 20, score: 65 },
    { type: 'joy', role: 'secondary',  opacity: 0.3, blur: 40, score: 65 },
    { type: 'joy', role: 'background', opacity: 0.1, blur: 60, score: 65 },
  ],
  keywords: [
    { keyword: '첫 직장' },
    { keyword: '취업' },
    { keyword: '연애' },
    { keyword: '결혼' },
  ],
  summary: {
    title: '오늘의 성과를 이뤄낸 당신에게 축하를 해주세요.\n당신은 여전이 잘 하고 있고, 앞으로도 잘 할 거에요.',
    description: '',
  },
  fact: '면접이 끝나고 한참동안 조마조마하고 있었는데, 원하던 기업에 입사하게 되었다.',
  emotion: '장기간 취업이 안되어 힘들었는데 오늘은 몸에 스트레스가 풀릴 정도로 기쁜 소식을 받게 되어 안도감도 들었다.',
  insight: '지금처럼 성공에 관한 감정과 그 느낌을 갖고 앞으로 나아가기. 반복된 경험을 통해 성공과 기쁨을 체화시키기.',
  createdAt: null,
};

export function LargeCardSection() {
  return (
    // 2515:11379 — 527×784px, VERTICAL, gap:40, counterAlign:CENTER
    <div className="flex flex-col items-center" style={{ width: 527, gap: 40 }}>

      {/* TextBlock 2515:11380 — 527×144px, VERTICAL, gap:40, CENTER */}
      <div className="flex flex-col items-center text-center" style={{ width: 527, gap: 40 }}>

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
          여러분의 감정에는 패턴이 있습니다
        </h2>

        {/* Body — 16px Regular #3F527E */}
        <p
          className="body-1 whitespace-pre-line text-center text-prime-700"
        >
          {'반복되는 감정에는 이유가 있어요.\n어떤 상황에서, 어떤 사람과 함께할 때 마음이 흔들리는지.\n저희는 그 흐름을 함께 기록하고, 여러분이 스스로를 더 잘 이해할 수 있도록 돕습니다.'}
        </p>
      </div>

      {/* Card Sample 2515:11383 — 350×600px, 정적 표시 (flip 없음) */}
      <EmotionCardBack
        data={CARD_DATA}
        layers={CARD_DATA.layers}
        emotionLabel="JOY"
        width={350}
        height={600}
      />
    </div>
  );
}
