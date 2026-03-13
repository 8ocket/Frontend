'use client';

import { cn } from '@/lib/utils';
import { EMOTION_META } from './constants';
import type { EmotionBrushProps } from './types';
import type { BrushShape } from '@/types/emotion';

/**
 * 감정 브러시 SVG 컴포넌트
 *
 * Figma "CARD BRUSH" 레이어에 대응합니다.
 * 감정 타입에 따라 6가지 브러시 형태를 렌더링합니다:
 *
 * | 감정              | 브러시           | 설명                |
 * |------------------|-----------------|---------------------|
 * | joy, trust, anticipation | circle  | 단순 원형           |
 * | fear             | textured-circle | 텍스처가 있는 원형   |
 * | sadness          | gradient-circle | 그라데이션 원형      |
 * | surprise         | four-point-star | 사각 별 형태        |
 * | disgust          | spiky-star      | 뾰족한 8각 별       |
 * | anger            | lightning       | 번개 형태           |
 */
export function EmotionBrush({
  emotionType,
  color,
  opacity,
  blur,
  size = 400,
  className,
  style,
}: EmotionBrushProps & { style?: React.CSSProperties }) {
  const meta = EMOTION_META[emotionType];
  const shape = meta.brushShape;

  return (
    <div
      className={cn('pointer-events-none', className)}
      style={{
        width: size,
        height: size,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <BrushSVG shape={shape} color={color} size={400} />
      </svg>
    </div>
  );
}

/** 브러시 형태별 SVG 내부 요소 */
function BrushSVG({ shape, color, size }: { shape: BrushShape; color: string; size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.43;

  switch (shape) {
    // ─── 단순 원형 (joy, trust, anticipation) ───
    case 'circle':
      return <circle cx={cx} cy={cy} r={r} fill={color} />;

    // ─── 텍스처 원형 (fear) ───
    case 'textured-circle':
      return (
        <>
          <defs>
            <filter id="brush-texture" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.03"
                numOctaves={3}
                seed={42}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={30}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
          <circle cx={cx} cy={cy} r={r} fill={color} filter="url(#brush-texture)" />
        </>
      );

    // ─── 그라데이션 원형 (sadness) ───
    case 'gradient-circle':
      return (
        <>
          <defs>
            <radialGradient id="brush-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="70%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r} fill="url(#brush-gradient)" />
        </>
      );

    // ─── 사각 별 (surprise) ───
    case 'four-point-star': {
      const outer = r;
      const inner = r * 0.35;
      const d = [
        `M ${cx} ${cy - outer}`,
        `Q ${cx + inner} ${cy - inner} ${cx + outer} ${cy}`,
        `Q ${cx + inner} ${cy + inner} ${cx} ${cy + outer}`,
        `Q ${cx - inner} ${cy + inner} ${cx - outer} ${cy}`,
        `Q ${cx - inner} ${cy - inner} ${cx} ${cy - outer}`,
        'Z',
      ].join(' ');
      return <path d={d} fill={color} />;
    }

    // ─── 뾰족한 8각 별 (disgust) ───
    case 'spiky-star': {
      const points = 8;
      const outerR = r;
      const innerR = r * 0.5;
      const pts: string[] = [];
      for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? outerR : innerR;
        pts.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
      }
      return <polygon points={pts.join(' ')} fill={color} />;
    }

    // ─── 번개 (anger) ───
    case 'lightning': {
      const d = [
        `M ${cx + 10} ${cy - r}`,
        `L ${cx - 40} ${cy - 10}`,
        `L ${cx + 5} ${cy + 5}`,
        `L ${cx - 30} ${cy + r}`,
        `L ${cx + 60} ${cy - 20}`,
        `L ${cx + 10} ${cy - 30}`,
        'Z',
      ].join(' ');
      return <path d={d} fill={color} />;
    }

    default:
      return <circle cx={cx} cy={cy} r={r} fill={color} />;
  }
}
