'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { EmotionCardFront, EmotionCardBack, getEmotionDisplayName } from '@/widgets/emotion-card';
import type { EmotionCardData } from '@/entities/emotion';
import { MOCK_COLLECTION_CARDS } from '@/mocks/emotion';

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

  return (
    <div className="flex w-full flex-col gap-2">
      {/* 날짜 */}
      <div className="flex items-center gap-1.75" style={{ width: 350 }}>
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
        style={{ width: 350, height: 600 }}
        whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
        transition={{ duration: 0.2 }}
      >
        <EmotionCardFront
          layers={data.layers}
          emotionLabel={emotionLabel}
          width={350}
          height={600}
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

// ─── 메인 페이지 ───

export default function CollectionPage() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sortedCards = [...MOCK_COLLECTION_CARDS]
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 7);

  const activeCard = sortedCards.find((c) => c.cardId === activeCardId) ?? null;

  return (
    <div className="min-h-main-safe">
      <div className="mx-auto max-w-360 px-4 py-12 sm:px-8">
        {/* 헤더 */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <h1 className="heading-01 text-prime-900 text-center">마음기록 모음</h1>
          <p className="text-prime-700 text-sm font-medium">
            여러분들이 지금까지 상담받은 내역을 확인하실 수 있어요.
          </p>
        </div>

        {/* 카드 그리드 — 3열 */}
        <div
          className="relative"
          style={{
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          }}
        >
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCards.map((card) => (
              <GridCard
                key={card.cardId}
                data={card}
                isActive={activeCardId === card.cardId}
                onClick={() => setActiveCardId(card.cardId)}
              />
            ))}
          </div>
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
