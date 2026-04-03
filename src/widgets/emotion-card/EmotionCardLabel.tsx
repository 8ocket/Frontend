'use client';

import { cn } from '@/shared/lib/utils';
import type { EmotionCardLabelProps } from './types';

/**
 * 감정 카드 라벨
 * - top-left: 좌상단 정방향
 * - bottom-right: 우하단 180° 회전
 *
 * Figma: Cormorant Garamond, 26px, Regular
 * CSS 클래스: card-01 (globals.css)
 */
export function EmotionCardLabel({ label, position, className }: EmotionCardLabelProps) {
  const isBottomRight = position === 'bottom-right';

  return (
    <span
      className={cn(
        'absolute text-prime-900 select-none pointer-events-none font-semibold',
        isBottomRight ? 'bottom-4 right-4 rotate-180' : 'top-4 left-1/2 -translate-x-1/2',
        className ?? 'card-01',
      )}
      aria-hidden={isBottomRight}
    >
      {label}
    </span>
  );
}
