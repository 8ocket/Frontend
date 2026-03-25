'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import { CARD_SIZES, getEmotionDisplayName } from './constants';
import { EmotionCardFront } from './EmotionCardFront';
import { EmotionCardBack } from './EmotionCardBack';
import type { EmotionCardProps, CardFace } from './types';

/**
 * 감정 카드 루트 컴포넌트
 *
 * 앞면(EmotionCardFront)과 뒷면(EmotionCardBack)을 CSS 3D 플립으로 전환합니다.
 * - 클릭 시 카드가 Y축 기준 180° 회전
 * - perspective로 3D 깊이감 부여
 * - backface-visibility로 반대면 숨김
 */
export function EmotionCard({
  data,
  initialFace = 'front',
  size = 'default',
  width: customWidth,
  onFlip,
  labelOverride,
  className,
}: EmotionCardProps) {
  const [face, setFace] = useState<CardFace>(initialFace);
  const isFlipped = face === 'back';

  // 카드 크기 계산 — customWidth 우선, 없으면 프리셋
  const preset = CARD_SIZES[size];
  const cardWidth = customWidth ?? preset.width;
  const aspectRatio = preset.height / preset.width;
  const cardHeight = Math.round(cardWidth * aspectRatio);

  // 주감정에서 영문 라벨 추출
  const primaryLayer = data.layers.find((l) => l.role === 'primary');
  const emotionLabel = labelOverride?.toUpperCase()
    ?? (primaryLayer ? getEmotionDisplayName(primaryLayer.type, null).toUpperCase() : 'EMOTION');

  const handleFlip = useCallback(() => {
    const next: CardFace = isFlipped ? 'front' : 'back';
    setFace(next);
    onFlip?.(next);
  }, [isFlipped, onFlip]);

  return (
    <div
      className={cn('cursor-pointer select-none', className)}
      style={{
        width: cardWidth,
        height: cardHeight,
        perspective: 1200,
      }}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`감정 카드 — ${emotionLabel}. ${isFlipped ? '뒷면' : '앞면'} 표시 중. 클릭하여 뒤집기`}
    >
      <div
        className="relative h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 앞면 */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <EmotionCardFront
            layers={data.layers}
            emotionLabel={emotionLabel}
            width={cardWidth}
            height={cardHeight}
          />
        </div>

        {/* 뒷면 (Y축 180° 미리 회전 — 플립 시 정방향) */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <EmotionCardBack
            data={data}
            layers={data.layers}
            emotionLabel={emotionLabel}
            width={cardWidth}
            height={cardHeight}
          />
        </div>
      </div>
    </div>
  );
}
