'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { EmotionCardFront, EmotionCardBack, getEmotionDisplayName } from '@/widgets/emotion-card';
import type { EmotionCardData } from '@/entities/emotion';
import { useCollectionStore } from '@/entities/emotion';
import { EmotionColorLegend } from '@/widgets/emotion-color-legend';

/** 날짜 형식: YYYY.MM.DD */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** 주감정 영문 라벨 추출 */
function getEmotionLabel(data: EmotionCardData): string {
  const primaryLayer = data.layers.find((l) => l.role === 'primary');
  return primaryLayer ? getEmotionDisplayName(primaryLayer.type, null).toUpperCase() : 'EMOTION';
}

// ─── 그리드 카드 ───

function GridCard({
  data,
  isActive,
  onClick,
}: {
  data: EmotionCardData;
  isActive: boolean;
  onClick: () => void;
}) {
  const emotionLabel = getEmotionLabel(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(350);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      if (w > 0) setCardWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardHeight = Math.round(cardWidth * (600 / 350));

  return (
    <div ref={containerRef} className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-1.75">
        <span className="subtitle-1 text-prime-600">Date :</span>
        <span className="subtitle-1 text-prime-600">
          {data.createdAt ? formatDate(new Date(data.createdAt)) : '—'}
        </span>
      </div>

      <motion.div
        layoutId={`card-${data.cardId}`}
        onClick={onClick}
        className={cn(
          'cursor-pointer overflow-hidden rounded-3xl select-none',
          'shadow-md ring-1 ring-black/5',
          isActive && 'invisible'
        )}
        style={{ width: cardWidth, height: cardHeight }}
        whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
        transition={{ duration: 0.2, layout: { duration: 0 } }}
      >
        <EmotionCardFront
          layers={data.layers}
          emotionLabel={emotionLabel}
          width={cardWidth}
          height={cardHeight}
        />
      </motion.div>
    </div>
  );
}

// ─── 확장 오버레이 ───

function CardOverlay({ data, onClose }: { data: EmotionCardData; onClose: () => void }) {
  const emotionLabel = getEmotionLabel(data);
  const W = 400;
  const H = 686;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-4">
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <motion.div
          layoutId={`card-${data.cardId}`}
          style={{ width: W, height: H, perspective: '1200px' }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
              <EmotionCardBack
                data={data}
                layers={data.layers}
                emotionLabel={emotionLabel}
                width={W}
                height={H}
                animated
              />
            </div>
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
                width={W}
                height={H}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Link
            href={`/chat?session=${data.sessionId}`}
            onClick={onClose}
            className={cn(
              'flex items-center justify-center rounded-lg border px-6 py-3.5',
              'border-cta-300 bg-secondary-100 text-prime-600',
              'hover:bg-neutral-100 active:bg-neutral-200',
              'text-base font-medium transition-colors'
            )}
            style={{ width: W }}
          >
            전체 상담내역 보기
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/** cards 배열을 "YYYY년 M월" 키로 그룹핑, 최신 월 순 정렬 */
function groupByMonth(cards: EmotionCardData[]): [string, EmotionCardData[]][] {
  const sorted = [...cards].sort(
    (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );

  const map = new Map<string, EmotionCardData[]>();
  for (const card of sorted) {
    const date = new Date(card.createdAt!);
    const key = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(card);
  }

  return Array.from(map.entries());
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

// ─── 메인 페이지 ───

export default function CollectionPage() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [monthIndex, setMonthIndex] = useState(0); // 0 = 가장 최신 월
  const [direction, setDirection] = useState<1 | -1>(1);
  const { cards, fetchCards } = useCollectionStore();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const groups = groupByMonth(cards);
  const totalMonths = groups.length;
  const [currentMonth, monthCards] = groups[monthIndex] ?? ['—', []];
  const activeCard = monthCards.find((c) => c.cardId === activeCardId) ?? null;

  function handleMonthChange(next: number) {
    setDirection(next > monthIndex ? 1 : -1);
    setMonthIndex(next);
    setActiveCardId(null);
  }

  return (
    <div className="flex min-h-main-safe flex-col">
      <div className="mx-auto flex w-full max-w-360 flex-1 flex-col px-4 py-12 sm:px-8">
        {/* 헤더 */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <h1 className="heading-01 text-prime-900 text-center">마음기록 모음</h1>
          <p className="text-prime-700 text-sm font-medium">
            여러분들이 지금까지 상담받은 내역을 확인하실 수 있어요.
          </p>
        </div>

        {/* 감정 색상 헬퍼 */}
        <div className="mb-6">
          <EmotionColorLegend />
        </div>

        {/* 월 네비게이션 */}
        {totalMonths > 0 && (
          <div className="mb-8 flex items-center justify-center gap-6">
            <button
              onClick={() => handleMonthChange(monthIndex + 1)}
              disabled={monthIndex >= totalMonths - 1}
              className="text-prime-600 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ‹
            </button>
            <span className="heading-03 text-prime-900 min-w-32 text-center">{currentMonth}</span>
            <button
              onClick={() => handleMonthChange(monthIndex - 1)}
              disabled={monthIndex <= 0}
              className="text-prime-600 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ›
            </button>
          </div>
        )}

        {/* 카드 그리드 */}
        <div className="relative flex-1 overflow-x-clip">
          {totalMonths === 0 ? (
            <p className="text-prime-500 text-center text-sm">아직 기록된 카드가 없어요.</p>
          ) : (
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={currentMonth}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="grid grid-cols-7 gap-x-6 gap-y-10"
              >
                {monthCards.map((card) => (
                  <GridCard
                    key={card.cardId}
                    data={card}
                    isActive={activeCardId === card.cardId}
                    onClick={() => setActiveCardId(card.cardId)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* 오버레이 */}
      <AnimatePresence>
        {activeCard && (
          <CardOverlay
            key={activeCard.cardId}
            data={activeCard}
            onClose={() => setActiveCardId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
