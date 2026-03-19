'use client';

import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import {
  EmotionCard,
} from '@/components/emotion';
import type { EmotionCardData } from '@/entities/emotion';
import { MOCK_COLLECTION_CARDS } from '@/mocks/emotion';

/** 날짜를 Figma 형식으로 포맷 (YYYY.MM.DD) */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

// ─── 컬렉션 카드 아이템 ───

function CollectionCardItem({ data }: { data: EmotionCardData }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {/* 날짜 */}
      <div className="flex items-center gap-1.75">
        <span className="subtitle-1 text-prime-600">Date :</span>
        <span className="subtitle-1 text-prime-600">
          {data.createdAt ? formatDate(new Date(data.createdAt)) : '—'}
        </span>
      </div>

      {/* 감정 카드 (뒷면이 기본) + 버튼 */}
      <div className="flex w-87.5 flex-col gap-4">
        <EmotionCard data={data} initialFace="back" size="sample" />

        {/* 전체 상담내역 보기 */}
        <Link
          href={`/chat?session=${data.sessionId}`}
          className={cn(
            'flex w-full items-center justify-center rounded-lg border px-6 py-3.5',
            'border-cta-300 bg-secondary-100 text-prime-600',
            'hover:bg-neutral-100 active:bg-neutral-200',
            'text-base font-medium transition-colors'
          )}
        >
          전체 상담내역 보기
        </Link>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ───

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-360 px-4 py-12 sm:px-8">
        {/* 헤더 */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <h1 className="heading-01 text-prime-900 text-center">마음기록 모음</h1>
          <p className="text-prime-700 text-sm font-medium">
            여러분들이 지금까지 상담받은 내역을 확인하실 수 있어요.
          </p>
        </div>

        {/* 카드 그리드 — 3열 */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {[...MOCK_COLLECTION_CARDS]
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 7)
            .map((card) => (
            <CollectionCardItem key={card.cardId} data={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
