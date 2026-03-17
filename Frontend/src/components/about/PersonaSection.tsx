'use client';

import Image from 'next/image';

// Figma 2515:11361 — PersonaSection
// Frame: 820×655px, VERTICAL, gap:40, counterAlign:CENTER
//
// TextBlock (2515:11362): 505×166px, VERTICAL, gap:8, CENTER
//   Title:   20px SemiBold #1A222E
//   Body:    16px Regular  #3F527E
//   Caption: 12px Medium   #697BA6 (r:0.412 g:0.514 b:0.667)
//
// PersonaCards Row (2515:11367): 820×449px, HORIZONTAL, gap:80
//   3 "AI 상담사 종류" INSTANCE — 각 220px wide, VERTICAL, gap:8
//   이미지: 220×328px, 텍스트: VERTICAL, gap:4
//   Card 1: 정신건강 상담사 (24px SemiBold) / 설명 (16px Regular)
//   Card 2: 진로 및 학업 상담사 (24px SemiBold) / 설명 (16px Regular)
//   Card 3: 코칭 심리 상담사 (24px SemiBold) / 설명 (16px Regular)

// Figma 확인 텍스트 (2515:11368 ~ 2515:11370 "AI 상담사 종류" 노드)
const PERSONAS = [
  {
    name: '정신건강 상담사',
    description: '감정 소진, 불안, 우울감 등 정서적 케어와 공감에 집중',
    imageSrc: '/images/personas/mental.png',
    cardHeight: 423,
    imageHeight: 328,
  },
  {
    name: '진로 및 학업 상담사',
    description: '목표 설정, 번아웃 관리, 진로 탐색 등 성취와 관련된 고민 구조화',
    imageSrc: '/images/personas/career.png',
    cardHeight: 423,
    imageHeight: 328,
  },
  {
    name: '코칭 심리 상담사',
    description: '대인관계, 의사소통 일상적 스트레스 관리 등 실질적인 행동 변화와 솔루션 제안',
    imageSrc: '/images/personas/coaching.png',
    cardHeight: 449,
    imageHeight: 328,
  },
];

export function PersonaSection() {
  return (
    // 2515:11361 — 820×655px, VERTICAL, gap:40, counterAlign:CENTER
    <div className="flex flex-col items-center" style={{ width: 820, gap: 40 }}>

      {/* TextBlock 2515:11362 — 505×166px, VERTICAL, gap:8, CENTER */}
      <div className="flex flex-col items-center text-center" style={{ width: 505, gap: 8 }}>

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
          여러분의 마음을 지켜줄게요
        </h2>

        {/* Body — 16px Regular #3F527E */}
        <p
          className="body-1 whitespace-pre-line text-center"
          style={{ color: '#3F527E' }}
        >
          {'여러분이 느끼는 감정은 그 자체로 소중합니다. \n마인드 로그는 그 감정을 안전하게 꺼내놓고, 스스로 이해할 수 있도록 함께합니다.\n판단도, 진단도 없이. 오직 여러분의 마음에 집중합니다.'}
        </p>

        {/* Caption — 12px Medium r:0.412 g:0.514 b:0.667 */}
        <p
          className="caption-1"
          style={{
            fontWeight: 500,
            color: '#697AA9',
          }}
        >
          (추후에 더 많은 타입의 페르소나를 만나볼 수 있어요.)
        </p>
      </div>

      {/* PersonaCards Row 2515:11367 — 820×449px, HORIZONTAL, gap:80 */}
      <div className="flex flex-row" style={{ gap: 80 }}>
        {PERSONAS.map((persona) => (
          // 각 "AI 상담사 종류" INSTANCE — 220px wide, VERTICAL, gap:8
          <div
            key={persona.name}
            className="flex flex-col"
            style={{ width: 220, gap: 8 }}
          >
            {/* 이미지 영역 — 220×328px RECTANGLE */}
            <div
              className="relative w-full shrink-0 overflow-hidden rounded-lg"
              style={{ width: 220, height: persona.imageHeight }}
            >
              <Image
                src={persona.imageSrc}
                alt={persona.name}
                fill
                className="object-cover"
              />
            </div>

            {/* 텍스트 영역 — VERTICAL, gap:4 */}
            <div className="flex flex-col" style={{ gap: 4 }}>
              {/* 페르소나 이름 — 24px SemiBold #1A222E */}
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: '130%',
                  letterSpacing: '-0.015em',
                  color: '#1A222E',
                }}
              >
                {persona.name}
              </p>

              {/* 설명 — 16px Regular #3F527E */}
              <p
                className="body-1"
                style={{ color: '#3F527E' }}
              >
                {persona.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
