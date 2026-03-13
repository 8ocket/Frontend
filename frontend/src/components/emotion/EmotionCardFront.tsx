'use client';

import { cn } from '@/lib/utils';
import { EMOTION_META } from './constants';
import { EmotionBrush } from './EmotionBrush';
import { EmotionCardLabel } from './EmotionCardLabel';
import type { EmotionCardFrontProps } from './types';

/**
 * 감정 카드 앞면
 *
 * Figma 레이어 구조 (아래 → 위):
 * 1. 배경색 (주감정 10% opacity)
 * 2. Brush 03 — 보조감정 (blur 30px)
 * 3. Brush 02 — 부감정 (blur 20px)
 * 4. Brush 01 — 주감정 (blur 10px)
 * 5. 스크린 필터 (mix-blend-mode: screen)
 * 6. 감정명 라벨 (좌상단 + 우하단)
 *
 * 카드 크기 기본값: 400 × 686 (Figma CARD TEMPLETES 기준)
 */
export function EmotionCardFront({
  layers,
  emotionLabel,
  width,
  height,
  className,
}: EmotionCardFrontProps) {
  // 주감정(primary) 레이어에서 배경색 추출
  const primaryLayer = layers.find((l) => l.role === 'primary');
  const primaryMeta = primaryLayer ? EMOTION_META[primaryLayer.type] : null;
  const bgColor = primaryMeta?.hex ?? '#f8fafc';

  // 브러시 크기는 카드 너비 기준
  const brushSize = width;

  // 레이어를 역순으로 (background → secondary → primary) 렌더링
  const sortedLayers = [...layers].sort((a, b) => {
    const order = { background: 0, secondary: 1, primary: 2 };
    return order[a.role] - order[b.role];
  });

  // 각 브러시의 위치 오프셋 (Figma 기준)
  const positionMap: Record<string, { top: string; left: string }> = {
    primary: { top: '60%', left: '50%' },
    secondary: { top: '20%', left: '10%' },
    background: { top: '15%', left: '80%' },
  };

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl', className)}
      style={{
        width,
        height,
        backgroundColor: `color-mix(in srgb, ${bgColor} 10%, transparent)`,
      }}
    >
      {/* 브러시 레이어 */}
      {sortedLayers.map((layer) => {
        const meta = EMOTION_META[layer.type];
        const pos = positionMap[layer.role];

        return (
          <EmotionBrush
            key={layer.role}
            emotionType={layer.type}
            color={meta.hex}
            opacity={layer.opacity}
            blur={layer.blur}
            size={brushSize}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
          />
        );
      })}

      {/* 스크린 블렌드 필터 (Figma: mix-blend-mode: screen) */}
      <div
        className="absolute inset-0 rounded-2xl mix-blend-screen pointer-events-none"
        style={{ filter: 'blur(50px)' }}
        aria-hidden="true"
      />

      {/* 감정명 라벨 */}
      <EmotionCardLabel label={emotionLabel} position="top-left" />
      <EmotionCardLabel label={emotionLabel} position="bottom-right" />
    </div>
  );
}
