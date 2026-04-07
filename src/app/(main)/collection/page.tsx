'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { EmotionCardFront, EmotionCardBack, getEmotionDisplayName } from '@/widgets/emotion-card';
import type { EmotionCardData } from '@/entities/emotion';
import { useCollectionStore } from '@/entities/emotion';

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

// ─── 그리드 카드 (기본 상태: 그라데이션 뒷면) ───

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
      {/* 날짜 */}
      <div className="flex items-center gap-1.75">
        <span className="subtitle-1 text-prime-600">Date :</span>
        <span className="subtitle-1 text-prime-600">
          {data.createdAt ? formatDate(new Date(data.createdAt)) : '—'}
        </span>
      </div>

      {/* 카드 — layoutId로 오버레이와 연결 */}
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
      {/* 딤 배경 */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* 확장 카드 + 버튼 */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* layoutId → 그리드 위치에서 중앙으로 FLIP */}
        <motion.div
          layoutId={`card-${data.cardId}`}
          style={{ width: W, height: H, perspective: '1200px' }}
        >
          {/* rotateY: 뒷면(-180°) → 앞면(0°) */}
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
            {/* 앞면: 유리 패널 (상세 정보) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
              }}
            >
              <EmotionCardBack
                data={data}
                layers={data.layers}
                emotionLabel={emotionLabel}
                width={W}
                height={H}
                animated
              />
            </div>

            {/* 뒷면: 그라데이션 (사전 180° 회전) */}
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

        {/* 전체 상담내역 보기 */}
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

const COLS = 7;
const COL_GAP = 24; // gap-x-6 (1.5rem)
const ROW_GAP = 40; // gap-y-10 (2.5rem)
const DATE_ROW_HEIGHT = 32 + 8; // 날짜 라벨 높이 + gap-2(8px)
const PAGINATION_RESERVE = 160; // 페이지네이션(32) + mt-10(40) + py-12 하단(48) + 여유(40)

// ─── 메인 페이지 ───

export default function CollectionPage() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(COLS);
  const [direction, setDirection] = useState<1 | -1>(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const { cards, fetchCards } = useCollectionStore();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // 뷰포트 높이 기준으로 한 페이지에 표시할 카드 수 계산
  useEffect(() => {
    function calculate() {
      const el = gridRef.current;
      if (!el) return;

      const containerWidth = el.offsetWidth;
      if (containerWidth === 0) return;

      const cardWidth = (containerWidth - (COLS - 1) * COL_GAP) / COLS;
      const cardHeight = Math.round(cardWidth * (600 / 350));
      const rowHeight = DATE_ROW_HEIGHT + cardHeight;

      const rect = el.getBoundingClientRect();
      const available = window.innerHeight - rect.top - PAGINATION_RESERVE;
      const rows = Math.max(1, Math.floor(available / (rowHeight + ROW_GAP)));

      setPageSize(COLS * rows);
    }

    calculate();

    const observer = new ResizeObserver(calculate);
    if (gridRef.current) observer.observe(gridRef.current);
    window.addEventListener('resize', calculate);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculate);
    };
  }, []);

  const sortedCards = [...cards].sort(
    (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sortedCards.length / pageSize));
  const pagedCards = sortedCards.slice((page - 1) * pageSize, page * pageSize);
  const activeCard = pagedCards.find((c) => c.cardId === activeCardId) ?? null;

  function handlePageChange(next: number) {
    setDirection(next > page ? 1 : -1);
    setPage(next);
    setActiveCardId(null);
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
  };

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

        {/* 카드 그리드 — 7열 */}
        <div ref={gridRef} className="relative flex-1 overflow-x-clip">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid grid-cols-7 gap-x-6 gap-y-10"
            >
              {pagedCards.map((card) => (
                <GridCard
                  key={card.cardId}
                  data={card}
                  isActive={activeCardId === card.cardId}
                  onClick={() => setActiveCardId(card.cardId)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="text-prime-600 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors',
                  p === page
                    ? 'text-main-blue bg-blue-50 font-semibold'
                    : 'text-prime-600 hover:bg-slate-100'
                )}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="text-prime-600 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ›
            </button>
          </div>
        )}
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
