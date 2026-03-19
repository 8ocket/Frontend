'use client';

import { cn } from '@/shared/lib/utils';
import type { EmotionBrushProps } from './types';

/**
 * 감정 브러시 컴포넌트
 *
 * Figma "CARD BRUSH" 레이어에 대응합니다.
 * public/images/brushes/{emotionType}.svg 파일을 사용합니다.
 * (Figma API로 export한 원본 벡터 + TEXTURE 필터 포함)
 */
export function EmotionBrush({
  emotionType,
  opacity,
  blur,
  size = 400,
  className,
  style,
}: Omit<EmotionBrushProps, 'color'> & { color?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('pointer-events-none shrink-0', className)}
      style={{
        width: size,
        height: size,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/brushes/${emotionType}.svg`}
        width={size}
        height={size}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ display: 'block', width: size, height: size }}
      />
    </div>
  );
}
