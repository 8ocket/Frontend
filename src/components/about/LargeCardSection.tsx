'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// ─── 차트 데이터 ───

const DATA = [
  { score: 20,  emotion: '평온', label: '03.17' },
  { score: -35, emotion: '불안', label: '03.18' },
  { score: 15,  emotion: '보통', label: '03.19' },
  { score: 60,  emotion: '기쁨', label: '03.20' },
  { score: -10, emotion: '피로', label: '03.21' },
  { score: 72,  emotion: '행복', label: '03.22' },
  { score: 45,  emotion: '안정', label: '03.23' },
];

// ─── SVG 좌표계 ───

const W = 720;
const H = 280;
const M = { top: 24, right: 24, bottom: 44, left: 48 };
const CW = W - M.left - M.right; // 차트 너비
const CH = H - M.top - M.bottom; // 차트 높이

const toX = (i: number) => M.left + (i / (DATA.length - 1)) * CW;
const toY = (score: number) => M.top + ((100 - score) / 200) * CH;

// Cardinal spline → Cubic Bezier 변환
function buildLinePath(): string {
  const pts = DATA.map((d, i) => ({ x: toX(i), y: toY(d.score) }));
  const T = 0.5; // tension

  const tan = pts.map((_, i) => {
    if (i === 0)             return { dx: T * (pts[1].x - pts[0].x),     dy: T * (pts[1].y - pts[0].y) };
    if (i === pts.length - 1) return { dx: T * (pts[i].x - pts[i-1].x),  dy: T * (pts[i].y - pts[i-1].y) };
    return { dx: T * (pts[i+1].x - pts[i-1].x), dy: T * (pts[i+1].y - pts[i-1].y) };
  });

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const c1x = (pts[i].x   + tan[i].dx   / 3).toFixed(1);
    const c1y = (pts[i].y   + tan[i].dy   / 3).toFixed(1);
    const c2x = (pts[i+1].x - tan[i+1].dx / 3).toFixed(1);
    const c2y = (pts[i+1].y - tan[i+1].dy / 3).toFixed(1);
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${pts[i+1].x.toFixed(1)},${pts[i+1].y.toFixed(1)}`;
  }
  return d;
}

function buildAreaPath(): string {
  const zeroY = toY(0).toFixed(1);
  return `${buildLinePath()} L ${toX(DATA.length - 1).toFixed(1)},${zeroY} L ${toX(0).toFixed(1)},${zeroY} Z`;
}

const LINE_PATH = buildLinePath();
const AREA_PATH = buildAreaPath();
const ZERO_Y    = toY(0);
const TICKS     = [-100, -50, 0, 50, 100];

// ─── 정적 SVG 차트 (인터랙션 없음, 라인 드로잉 모션만) ───

function EmotionChart() {
  const ref   = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', pointerEvents: 'none', userSelect: 'none' }}
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--main-blue)" stopOpacity={0.18} />
          <stop offset="100%" stopColor="var(--main-blue)" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* 가로 그리드 & Y축 레이블 */}
      {TICKS.map((t) => {
        const y = toY(t);
        return (
          <g key={t}>
            <line
              x1={M.left} y1={y} x2={W - M.right} y2={y}
              stroke={t === 0 ? '#cbd5e1' : '#e2e8f0'}
              strokeWidth={t === 0 ? 1.5 : 1}
              strokeDasharray={t === 0 ? '4 4' : undefined}
            />
            <text
              x={M.left - 8} y={y + 4}
              textAnchor="end"
              fontSize={11}
              fill="#94a3b8"
              fontFamily="inherit"
            >
              {t > 0 ? `+${t}` : t}
            </text>
          </g>
        );
      })}

      {/* X축 레이블 */}
      {DATA.map((d, i) => (
        <text
          key={d.label}
          x={toX(i)} y={H - M.bottom + 18}
          textAnchor="middle"
          fontSize={12}
          fill="#94a3b8"
          fontFamily="inherit"
        >
          {d.label}
        </text>
      ))}

      {/* 감정 레이블 (각 점 위/아래) */}
      {DATA.map((d, i) => {
        const x = toX(i);
        const y = toY(d.score);
        const above = d.score >= 0;
        return (
          <motion.text
            key={d.label + '-label'}
            x={x} y={above ? y - 14 : y + 20}
            textAnchor="middle"
            fontSize={11}
            fill="#64748b"
            fontFamily="inherit"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.4 + i * 0.08, duration: 0.3 }}
          >
            {d.emotion}
          </motion.text>
        );
      })}

      {/* 영역 채우기 — 라인 드로잉 후 fade-in */}
      <motion.path
        d={AREA_PATH}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      />

      {/* 라인 — pathLength 드로잉 모션 */}
      <motion.path
        d={LINE_PATH}
        fill="none"
        stroke="var(--main-blue)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ pathLength: { duration: 1.2, ease: 'easeInOut' }, opacity: { duration: 0.1 } }}
      />

      {/* 점 — 순차적으로 등장 */}
      {DATA.map((d, i) => (
        <motion.circle
          key={d.label + '-dot'}
          cx={toX(i)} cy={toY(d.score)} r={5}
          fill="var(--main-blue)"
          stroke="#fff"
          strokeWidth={2}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: 0.15 + i * (1.2 / DATA.length), duration: 0.25, type: 'spring', stiffness: 300 }}
          style={{ transformOrigin: `${toX(i)}px ${toY(d.score)}px` }}
        />
      ))}

      {/* 0점 기준선 위/아래 영역 표시 */}
      <line
        x1={M.left} y1={ZERO_Y} x2={W - M.right} y2={ZERO_Y}
        stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 5" strokeOpacity={0.35}
      />
    </svg>
  );
}

// ─── Section ───

export function LargeCardSection() {
  return (
    <div className="flex flex-col items-center" style={{ width: 1077, gap: 40 }}>
      {/* TextBlock */}
      <div className="flex flex-col items-center text-center" style={{ width: 600, gap: 16 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: '130%',
            letterSpacing: '-0.015em',
            color: '#1A222E',
          }}
        >
          여러분의 감정에는 패턴이 있습니다
        </h2>
        <p
          className="body-1 whitespace-pre-line text-center"
          style={{ color: '#3F527E', lineHeight: '160%', fontSize: '16px' }}
        >
          {'반복되는 감정에는 이유가 있어요.\n어떤 상황에서, 어떤 사람과 함께할 때 마음이 흔들리는지.\n저희는 그 흐름을 함께 기록하고, 여러분이 스스로를 더 잘 이해할 수 있도록 돕습니다.'}
        </p>
      </div>

      {/* 차트 카드 */}
      <div className="w-full rounded-[24px] border border-prime-100 bg-white p-10 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-prime-700">감정 변화 추이</h3>
            <p className="mt-1 text-[15px] text-prime-500">기간 동안의 감정 점수 변화</p>
          </div>
          <span className="rounded-full px-4 py-2 text-[13px] font-bold" style={{ background: 'var(--main-blue)', color: 'var(--color-prime-900)', opacity: 0.9 }}>
            주간
          </span>
        </div>
        <EmotionChart />
      </div>
    </div>
  );
}
