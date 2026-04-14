'use client';

// Figma 2515:11371 — SmallCardsSection

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  EmotionCardFront,
  EmotionCardBack,
  getEmotionDisplayName,
  CARD_SIZES,
} from '@/widgets/emotion-card';
import type { EmotionCardData } from '@/entities/emotion';

// ─── About 전용 고정 카드 데이터 ───
// 외부 mock에 의존하지 않음 — 이 파일 안에서만 관리
const SAMPLE_CARDS: EmotionCardData[] = [
  {
    cardId: 'about-joy',
    summaryId: 'about-joy',
    sessionId: 'about-sample',
    userName: '민지',
    layers: [
      { type: 'joy', role: 'primary',    opacity: 0.6, blur: 10 },
      { type: 'joy', role: 'secondary',  opacity: 0.3, blur: 20 },
      { type: 'joy', role: 'background', opacity: 0.1, blur: 30 },
    ],
    keywords: [{ keyword: '합격', emotionType: 'joy', percentage: 100 }],
    summary: { title: '오늘의 기쁨을 충분히 누려도 괜찮아요. 당신은 그럴 자격이 있어요.', description: '' },
    fact: '오랫동안 준비해온 취업 면접 결과가 나왔고, 최종 합격 통보를 받았다.',
    emotion: '몇 달간의 긴장과 불안이 한꺼번에 풀리는 느낌이었다. 온몸이 가벼워지고 눈물이 날 것 같은 기쁨이었다.',
    insight: '이 기쁨이 단순한 성공이 아니라, 포기하지 않은 나 자신에 대한 보상임을 느꼈다.',
    createdAt: null,
  },
  {
    cardId: 'about-anger',
    summaryId: 'about-anger',
    sessionId: 'about-sample',
    userName: '민지',
    layers: [
      { type: 'anger',   role: 'primary',    opacity: 0.6, blur: 10 },
      { type: 'disgust', role: 'secondary',  opacity: 0.3, blur: 20 },
      { type: 'anger',   role: 'background', opacity: 0.1, blur: 30 },
    ],
    keywords: [
      { keyword: '불공정', emotionType: 'anger',   percentage: 65 },
      { keyword: '무시',   emotionType: 'disgust', percentage: 35 },
    ],
    summary: { title: '그 분노는 당신의 기준과 가치관이 살아있다는 신호예요.', description: '' },
    fact: '팀 프로젝트에서 내가 작성한 보고서가 팀장의 이름으로 윗선에 보고되었다는 것을 알게 되었다.',
    emotion: '배신감과 함께 억울함이 치밀어 올랐다. 노력이 무시당한 것 같아 분하고 불쾌했다.',
    insight: '이 분노의 근원은 공정함과 인정에 대한 나의 강한 욕구임을 이해하게 되었다.',
    createdAt: null,
  },
  {
    cardId: 'about-sadness',
    summaryId: 'about-sadness',
    sessionId: 'about-sample',
    userName: '민지',
    layers: [
      { type: 'sadness', role: 'primary',    opacity: 0.6, blur: 10 },
      { type: 'fear',    role: 'secondary',  opacity: 0.3, blur: 20 },
      { type: 'sadness', role: 'background', opacity: 0.1, blur: 30 },
    ],
    keywords: [
      { keyword: '이별',   emotionType: 'sadness', percentage: 65 },
      { keyword: '외로움', emotionType: 'fear',    percentage: 35 },
    ],
    summary: { title: '슬픔은 소중했던 것이 있었다는 증거예요. 충분히 슬퍼해도 괜찮아요.', description: '' },
    fact: '오랫동안 함께했던 친구가 멀리 이사를 가게 되었다는 소식을 들었다.',
    emotion: '앞으로 자주 볼 수 없다는 사실이 실감나면서 가슴이 먹먹해졌다. 혼자 남겨지는 것 같은 두려움도 들었다.',
    insight: '이 슬픔은 관계를 소중히 여기는 내 마음에서 비롯된 것임을 알게 되었다.',
    createdAt: null,
  },
];

const { width: CARD_W, height: CARD_H } = CARD_SIZES.sample;

// ─── FlipCard ───

function FlipCard({
  data,
  delay,
  inView,
}: {
  readonly data: EmotionCardData;
  readonly delay: number;
  readonly inView: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const primary = data.layers.find((l) => l.role === 'primary');
  const emotionLabel = primary
    ? getEmotionDisplayName(primary.type, null).toUpperCase()
    : 'EMOTION';

  // 진입 전: 180deg 대기 / 진입 후: flipped 상태에 따라 0 ↔ 180
  const rotateY = !inView ? 180 : flipped ? 180 : 0;

  return (
    // 외부 래퍼: hover 시 "hovered" variant를 하위로 전파
    <motion.div
      style={{ width: CARD_W, height: CARD_H, cursor: 'pointer' }}
      initial="rest"
      whileHover="hovered"
      onClick={() => inView && setFlipped((f) => !f)}
    >
      {/* 호버 리프트 */}
      <motion.div
        style={{ width: '100%', height: '100%' }}
        variants={{ rest: { y: 0 }, hovered: { y: -16 } }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      >
        {/* 3D 플립 컨테이너 */}
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
          initial={{ rotateY: 180 }}
          animate={{ rotateY }}
          transition={{ type: 'spring', damping: 16, stiffness: 40, delay: !inView ? 0 : flipped ? 0 : delay }}
        >
          {/* 앞면 — EmotionCardBack(상담 데이터) + 광택 shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              overflow: 'hidden',
              borderRadius: 24,
            }}
          >
            <EmotionCardBack
              data={data}
              layers={data.layers}
              emotionLabel={emotionLabel}
              width={CARD_W}
              height={CARD_H}
            />
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.32) 50%, transparent 70%)',
                pointerEvents: 'none',
              }}
              variants={{ rest: { x: '-160%' }, hovered: { x: '160%' } }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>

          {/* 뒷면 — EmotionCardFront(브러시 시각) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <EmotionCardFront
              layers={data.layers}
              emotionLabel={emotionLabel}
              width={CARD_W}
              height={CARD_H}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section ───

export function SmallCardsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div className="flex w-full flex-col items-center px-4" style={{ maxWidth: 1077, gap: 80 }}>
      <div className="flex w-full flex-col items-center text-center" style={{ maxWidth: 551, gap: 16 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: '130%',
            letterSpacing: '-0.015em',
            color: '#1A222E',
          }}
        >
          여러분의 마음을 있는 그대로 바라보세요
        </h2>
        <p
          className="body-1 text-center whitespace-pre-line"
          style={{ color: '#3F527E', lineHeight: '160%', fontSize: '16px' }}
        >
          {
            '감정은 억누른다고 사라지지 않아요.\n다만 제대로 바라보지 못하면, 어느새 쌓이고 굳어버리기도 하죠.\n지금 여러분의 감정이 어디서 왔는지, 어떻게 흘러가고 있는지, 함께 들여다보고 싶습니다.'
          }
        </p>
      </div>

      {/* CardRow — perspective로 3D 입체감 부여 */}
      <div
        ref={ref}
        className="flex flex-row items-center justify-center"
        style={{ gap: 32, perspective: 1000 }}
      >
        {SAMPLE_CARDS.map((card, i) => (
          <FlipCard key={card.cardId} data={card} delay={i * 0.5} inView={inView} />
        ))}
      </div>
    </div>
  );
}
