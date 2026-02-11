'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Emotion {
  name: string;
  rgb: [number, number, number];
}

interface Blob {
  width: number;
  height: number;
  left: number;
  top: number;
  opacity: number;
  blur: number;
  r: number;
  g: number;
  b: number;
}

interface GenerateResult {
  blobs: Blob[];
  dominant: Emotion;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

// ── Plutchik 감정 바퀴 8가지 색상 ──────────────────────────────
// cSpell: disable-next-line
const EMOTIONS: Emotion[] = [
  { name: 'Rage', rgb: [196, 10, 10] },
  { name: 'Vigilance', rgb: [218, 85, 0] },
  { name: 'Ecstasy', rgb: [255, 185, 0] },
  { name: 'Admiration', rgb: [22, 120, 30] },
  { name: 'Terror', rgb: [0, 115, 95] },
  { name: 'Amazement', rgb: [28, 90, 195] },
  { name: 'Grief', rgb: [65, 30, 155] },
  { name: 'Loathing', rgb: [115, 20, 170] },
];

// ── 유틸 ──────────────────────────────────────────────────────
const rand = (a: number, b: number): number => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v: number, min = 0, max = 255): number => Math.min(max, Math.max(min, v));

// ── 블롭 데이터 생성 ───────────────────────────────────────────
function generateBlobs(
  activeIndices: number[],
  blobCount: number,
  blurMax: number
): GenerateResult {
  const colors = activeIndices.map((i) => EMOTIONS[i]);
  const dominant = pick(colors);

  const blobs: Blob[] = Array.from({ length: blobCount }, () => {
    const c = Math.random() < 0.7 ? dominant : pick(colors);
    const w = rand(100, 320);
    const h = rand(160, 500);

    return {
      width: w,
      height: h,
      left: rand(-w * 0.45, 350 - w * 0.55),
      top: rand(-h * 0.45, 600 - h * 0.55),
      opacity: rand(0.4, 0.92),
      blur: rand(blurMax * 0.35, blurMax),
      r: clamp(c.rgb[0] + rand(-25, 25)) | 0,
      g: clamp(c.rgb[1] + rand(-20, 20)) | 0,
      b: clamp(c.rgb[2] + rand(-20, 20)) | 0,
    };
  });

  return { blobs, dominant };
}

// ── Grain Canvas ───────────────────────────────────────────────
function drawGrain(canvas: HTMLCanvasElement | null, opacity: number): void {
  if (!canvas) return;
  const W = 350,
    H = 600;
  canvas.width = W;
  canvas.height = H;
  canvas.style.opacity = String(opacity);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const data = ctx.createImageData(W, H);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    data.data[i] = v;
    data.data[i + 1] = v;
    data.data[i + 2] = v;
    data.data[i + 3] = 210;
  }
  ctx.putImageData(data, 0, 0);
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────
export default function EmotionCardGenerator() {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [blobCount, setBlobCount] = useState<number>(7);
  const [blurAmt, setBlurAmt] = useState<number>(80);
  const [grainAmt, setGrainAmt] = useState<number>(55);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // blob 데이터 및 dominant 감정 계산
  const { blobs, dominant } = useMemo(() => {
    if (activeIndices.length === 0) {
      return { blobs: [], dominant: EMOTIONS[1] };
    }
    return generateBlobs(activeIndices, blobCount, blurAmt);
  }, [activeIndices, blobCount, blurAmt]);

  // grain: blobs 바뀔 때 + grainAmt 바뀔 때
  useEffect(() => {
    drawGrain(canvasRef.current, grainAmt / 100);
  }, [grainAmt, blobs]);

  const generate = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * EMOTIONS.length);
    setActiveIndices([randomIndex]);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (void setBlobCount, setBlurAmt, setGrainAmt);

  const toggleColor = (index: number) => {
    setActiveIndices((prev) => {
      if (prev.includes(index)) {
        if (prev.length === 1) return prev; // 최소 1개 유지
        return prev.filter((v) => v !== index);
      }
      return [...prev, index];
    });
  };

  const dominantColor = `rgb(${dominant.rgb.join(',')})`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] { -webkit-appearance: none; background: #333; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 10px; height: 10px;
          border-radius: 50%; background: #888; cursor: pointer;
        }
        .generate-btn:hover { border-color: #888 !important; color: #ddd !important; }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          minHeight: '100vh',
          background: '#0e0e0e',
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {/* 상단 타이틀 */}
        <p
          style={{
            color: '#333',
            fontSize: 11,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          Emotion Card Generator
        </p>

        {/* 카드 */}
        <div
          onClick={generate}
          title="클릭해서 재생성"
          style={{
            width: 350,
            height: 600,
            borderRadius: 30,
            position: 'relative',
            overflow: 'hidden',
            background: '#fff',
            cursor: 'pointer',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          }}
        >
          {blobs.map((blob, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: blob.width,
                height: blob.height,
                left: blob.left,
                top: blob.top,
                background: `rgb(${blob.r},${blob.g},${blob.b})`,
                opacity: blob.opacity,
                borderRadius: '50%',
                filter: `blur(${blob.blur.toFixed(1)}px)`,
                willChange: 'filter',
              }}
            />
          ))}

          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
              zIndex: 2,
            }}
          />

          {/* 좌상단 텍스트 */}
          <span
            style={{
              position: 'absolute',
              top: 22,
              left: 22,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              letterSpacing: '0.14em',
              color: 'rgba(0,0,0,0.75)',
              zIndex: 3,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {activeIndices.length > 0 ? dominant.name.toUpperCase() : ''}
          </span>

          {/* 우하단 텍스트 (180도 회전) */}
          <span
            style={{
              position: 'absolute',
              bottom: 22,
              right: 22,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              letterSpacing: '0.14em',
              color: 'rgba(0,0,0,0.75)',
              zIndex: 3,
              pointerEvents: 'none',
              userSelect: 'none',
              transform: 'rotate(180deg)',
            }}
          >
            {activeIndices.length > 0 ? dominant.name.toUpperCase() : ''}
          </span>
        </div>

        {/* 현재 감정 이름 */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.35em',
            color: dominantColor,
            textTransform: 'uppercase',
            height: 16,
            transition: 'color 0.4s ease',
          }}
        >
          {activeIndices.length > 0 ? dominant.name.toUpperCase() : ''}
        </p>

        {/* 컨트롤 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          {/* 팔레트 */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: 500,
            }}
          >
            {EMOTIONS.map((emotion, i) => {
              const isActive = activeIndices.includes(i);
              return (
                <div
                  key={emotion.name}
                  onClick={() => toggleColor(i)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: `rgb(${emotion.rgb.join(',')})`,
                      border: isActive ? '2px solid #fff' : '2px solid transparent',
                      opacity: isActive ? 1 : 0.25,
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isActive ? '#aaa' : '#333',
                      fontFamily: 'inherit',
                      transition: 'color 0.2s',
                    }}
                  >
                    {emotion.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 생성 버튼 */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="generate-btn"
              onClick={generate}
              style={{
                background: 'none',
                border: '1px solid #333',
                color: '#777',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 14,
                letterSpacing: '0.3em',
                padding: '10px 30px',
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              ↻ GENERATE
            </button>
            <button
              onClick={() => setActiveIndices([])}
              style={{
                background: 'none',
                border: '1px solid #999',
                color: '#999',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 14,
                letterSpacing: '0.3em',
                padding: '10px 30px',
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#999';
                e.currentTarget.style.color = '#999';
              }}
            >
              ↺ RESET
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
