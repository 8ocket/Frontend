'use client';

import { cn } from '@/shared/lib/utils';
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

  // color-mix()는 html-to-image에서 지원되지 않으므로 rgba로 직접 계산
  const bgRgba = (() => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  })();

  // 브러시 크기 — Figma: primary 100%, secondary 86%, background 71%
  const brushSizeMap: Record<string, number> = {
    primary: width,
    secondary: Math.round(width * 0.86),
    background: Math.round(width * 0.75),
  };

  // 레이어를 역순으로 (background → secondary → primary) 렌더링
  const sortedLayers = [...layers].sort((a, b) => {
    const order = { background: 0, secondary: 1, primary: 2 };
    return order[a.role] - order[b.role];
  });

  // 각 브러시의 위치 오프셋 (Figma 기준)
  // secondary/background는 카드 경계 밖으로 밀어 ambient glow 효과
  const positionMap: Record<string, { top: string; left: string }> = {
    primary:    { top: '71%', left: '50%' },
    secondary:  { top: '25%', left: '-5%' },
    background: { top: '21%', left: '103%' },
  };

  // CARD TEXT 크기 — Figma 기준: 175px→12px(card-03), 350px→24px(card-02), 400px→26px(card-01)
  let labelClass: string;
  if (width < 200) labelClass = 'card-03';
  else if (width < 380) labelClass = 'card-02';
  else labelClass = 'card-01';

  return (
    <div
      className={cn('relative overflow-hidden rounded-3xl ring-1 ring-white/20', className)}
      style={{
        width,
        height,
        backgroundColor: bgRgba,
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
            size={brushSizeMap[layer.role]}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
          />
        );
      })}


      {/* 감정명 라벨 */}
      <EmotionCardLabel label={emotionLabel} position="top-left" className={labelClass} />
      <EmotionCardLabel label={emotionLabel} position="bottom-right" className={labelClass} />
    </div>
  );
}
