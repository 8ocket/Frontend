'use client';

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

export interface EmotionDataPoint {
  label: string;
  score: number;
  emotion: string;
}

interface EmotionAreaChartProps {
  data: EmotionDataPoint[];
  type: 'weekly' | 'monthly';
}

interface CustomTooltipInternalProps {
  active?: boolean;
  payload?: { value: number; payload: EmotionDataPoint }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipInternalProps) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;

  // 감정 구간 판별
  const zone = score >= 30 ? '긍정' : score <= -30 ? '부정' : '중립';
  return (
    <div
      className="border-prime-100 rounded-2xl border bg-white px-4 py-3 shadow-lg"
      style={{ borderRadius: 16, padding: '12px 16px' }}
    >
      <p className="text-prime-400 mb-1 text-xs font-semibold">{label}</p>
      <p
        className="text-lg font-bold"
        style={{ color: score >= 0 ? 'var(--main-blue)' : 'var(--color-score-low)' }}
      >
        {score > 0 ? `+${score}` : score}점
      </p>
      <p className="text-prime-500 text-xs">{zone}구간</p>
      <p className="text-prime-500 text-xs">{payload[0].payload.emotion}</p>
    </div>
  );
}

export function EmotionAreaChart({ data, type }: EmotionAreaChartProps) {
  const avg = Math.round(data.reduce((s, d) => s + d.score, 0) / data.length);
  const max = Math.max(...data.map((d) => d.score));
  const min = Math.min(...data.map((d) => d.score));

  const commonAxisProps = {
    axisLine: false,
    tickLine: false,
    tick: { fontSize: 13, fill: '#94a3b8', fontFamily: 'inherit' },
  } as const;

  return (
    <div className="border-prime-100 rounded-[24px] border bg-white p-10 shadow-sm">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-prime-700 text-2xl font-bold tracking-tight">감정 변화 추이</h3>
          <span
            className="rounded-full px-4 py-2 text-[13px] font-bold tracking-tight"
            style={
              type === 'weekly'
                ? { background: 'var(--main-blue)', color: 'var(--color-prime-900)', opacity: 0.9 }
                : { background: '#d1d9e0', color: 'var(--color-neutral-800)' }
            }
          >
            {type === 'weekly' ? '주간' : '월간'}
          </span>
        </div>
        <p className="text-prime-500 text-[15px]">기간 동안의 감정 점수 변화를 확인하세요</p>
      </div>

      {/* 차트 */}
      <div className="h-90">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'weekly' ? (
            <LineChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-neutral-300)"
                vertical={false}
              />
              <XAxis dataKey="label" {...commonAxisProps} />
              <YAxis
                domain={[-100, 100]}
                ticks={[-65, 0, 65]}
                tickFormatter={(v) => (v === 65 ? '긍정' : v === 0 ? '중립' : '부정')}
              />
              <ReferenceLine
                y={0}
                stroke="var(--color-neutral-400)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <ReferenceLine
                y={30}
                stroke="var(--main-blue)"
                strokeDasharray="3 5"
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              <ReferenceLine
                y={-30}
                stroke="var(--color-score-low)"
                strokeDasharray="3 5"
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'var(--main-blue)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--main-blue)"
                strokeWidth={3}
                dot={{ fill: 'var(--main-blue)', r: 6, strokeWidth: 2, stroke: 'var(--white)' }}
                activeDot={{ r: 8, strokeWidth: 3, fill: 'var(--main-blue)' }}
                name="감정 점수"
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="mainBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--main-blue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--main-blue)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-neutral-300)"
                vertical={false}
              />
              <XAxis dataKey="label" {...commonAxisProps} />
              <YAxis
                domain={[-100, 100]}
                ticks={[-65, 0, 65]}
                tickFormatter={(v) => (v === 65 ? '긍정' : v === 0 ? '중립' : '부정')}
              />
              <ReferenceLine
                y={0}
                stroke="var(--color-neutral-400)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <ReferenceLine
                y={30}
                stroke="var(--main-blue)"
                strokeDasharray="3 5"
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              <ReferenceLine
                y={-30}
                stroke="var(--color-score-low)"
                strokeDasharray="3 5"
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'var(--main-blue)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--main-blue)"
                strokeWidth={3}
                fill="url(#mainBlueGrad)"
                name="감정 점수"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 통계 — 차트 아래 */}
      <div className="border-prime-100 mt-8 border-t pt-8">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: '평균 점수', value: avg, color: 'var(--main-blue)' },
            { label: '최고 점수', value: max, color: 'var(--color-score-high)' },
            { label: '최저 점수', value: min, color: 'var(--color-score-low)' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-prime-500 mb-2 text-[13px]">{label}</p>
              <p className="text-2xl font-bold tracking-tight" style={{ color }}>
                {value > 0 ? `+${value}` : value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
