'use client';

import type { SummaryListItem, SummaryResponse } from '@/entities/summary';
import { getSummaryApi, getSummaryListApi } from '@/entities/summary';
import { cn } from '@/shared/lib/utils';
import { EmotionColorLegend } from '@/widgets/emotion-color-legend';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/** 날짜 형식: YYYY.MM.DD */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

// ─── 그리드 카드 ───

function GridCard({
  data,
  isActive,
  onClick,
}: {
  data: SummaryListItem;
  isActive: boolean;
  onClick: () => void;
}) {
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
          {formatDate(new Date(data.createdAt))}
        </span>
      </div>

      <motion.div
        layoutId={`card-${data.summaryId}`}
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
        <Image
          src={data.frontImageUrl}
          alt="마음 기록 카드"
          width={cardWidth}
          height={cardHeight}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );
}

// ─── 확장 오버레이 ───

function CardOverlay({ data, onClose }: { data: SummaryListItem; onClose: () => void }) {
  const W = 400;
  const H = 686;
  const [detail, setDetail] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSummaryApi(data.summaryId)
      .then(setDetail)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [data.summaryId]);

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
          layoutId={`card-${data.summaryId}`}
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
            {/* 뒷면 */}
            <div
              style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}
              className="overflow-hidden rounded-3xl"
            >
              <div className="relative h-full w-full">
                <Image
                  src={data.backImageUrl}
                  alt="마음 기록 카드 뒷면"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-x-4 top-12 bottom-12 overflow-y-auto rounded-2xl bg-white/80 p-5 backdrop-blur-md">
                  {isLoading ? (
                    <p className="text-prime-500 text-sm">불러오는 중...</p>
                  ) : detail ? (
                    <div className="flex flex-col gap-4 text-sm">
                      {detail.fact && (
                        <div>
                          <p className="text-prime-900 mb-1 font-semibold">사건</p>
                          <p className="text-prime-700">{detail.fact}</p>
                        </div>
                      )}
                      {detail.emotion && (
                        <div>
                          <p className="text-prime-900 mb-1 font-semibold">느꼈던 감정</p>
                          <p className="text-prime-700">{detail.emotion}</p>
                        </div>
                      )}
                      {detail.insight && (
                        <div>
                          <p className="text-prime-900 mb-1 font-semibold">AI 인사이트</p>
                          <p className="text-prime-700">{detail.insight}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-prime-500 text-sm">내용을 불러올 수 없어요.</p>
                  )}
                </div>
              </div>
            </div>

            {/* 앞면 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="overflow-hidden rounded-3xl"
            >
              <Image
                src={data.frontImageUrl}
                alt="마음 기록 카드 앞면"
                width={W}
                height={H}
                className="h-full w-full object-cover"
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
function groupByMonth(cards: SummaryListItem[]): [string, SummaryListItem[]][] {
  const sorted = [...cards].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const map = new Map<string, SummaryListItem[]>();
  for (const card of sorted) {
    const date = new Date(card.createdAt);
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
  const [monthIndex, setMonthIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const { data: cards = [] } = useQuery({
    queryKey: ['summaryList'],
    queryFn: () => getSummaryListApi().then((res) => res.content),
  });

  const groups = groupByMonth(cards);
  const totalMonths = groups.length;
  const [currentMonth, monthCards] = groups[monthIndex] ?? ['—', []];
  const activeCard = monthCards.find((c) => c.summaryId === activeCardId) ?? null;

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
                className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 sm:gap-x-4 md:gap-x-6 md:gap-y-10"
              >
                {monthCards.map((card) => (
                  <GridCard
                    key={card.summaryId}
                    data={card}
                    isActive={activeCardId === card.summaryId}
                    onClick={() => setActiveCardId(card.summaryId)}
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
            key={activeCard.summaryId}
            data={activeCard}
            onClose={() => setActiveCardId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
