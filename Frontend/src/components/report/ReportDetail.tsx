'use client';

import { addDays, format } from 'date-fns';
import { Calendar, Download, Sparkles, Target, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { EmotionAreaChart } from './EmotionAreaChart';
import type { EmotionDataPoint } from './EmotionAreaChart';
import type { Report } from './types';

interface ReportDetailProps {
  report: Report;
  onPdfDownload?: () => void;
}

// '2026.03.17 - 2026.03.23' 형식에서 시작일 파싱
function parsePeriodStart(period: string): Date {
  const startStr = period.split(' - ')[0]; // '2026.03.17'
  const [y, m, d] = startStr.split('.').map(Number);
  return new Date(y, m - 1, d);
}

// TODO [API]: WEEKLY_SCORES, MONTHLY_SCORES 제거하고 buildChartData의 반환값을
//             GET /reports/:id/chart-data 응답(EmotionDataPoint[])으로 교체
//             응답 형식 예시: [{ label: '03.17', score: 20, emotion: '평온' }, ...]
const WEEKLY_SCORES: { score: number; emotion: string }[] = [
  { score: 20, emotion: '평온' },
  { score: -35, emotion: '불안' },
  { score: 15, emotion: '보통' },
  { score: 60, emotion: '기쁨' },
  { score: -10, emotion: '피로' },
  { score: 72, emotion: '행복' },
  { score: 45, emotion: '안정' },
];

const MONTHLY_SCORES: { score: number; emotion: string }[] = [
  { score: 30, emotion: '안정' },
  { score: -20, emotion: '스트레스' },
  { score: 55, emotion: '기쁨' },
  { score: 40, emotion: '평온' },
];

function buildChartData(report: Report): EmotionDataPoint[] {
  const start = parsePeriodStart(report.period);
  if (report.reportType === 'weekly') {
    return WEEKLY_SCORES.map((d, i) => ({
      ...d,
      label: format(addDays(start, i), 'MM.dd'),
    }));
  }
  // 월간: 매주 시작일 기준 4개 데이터 포인트
  return MONTHLY_SCORES.map((d, i) => ({
    ...d,
    label: format(addDays(start, i * 7), 'MM.dd'),
  }));
}

interface Keyword {
  text: string;
  count: number;
  isTop?: boolean;
}

// TODO [API]: KEYWORDS, 키워드 통계(총 키워드 수/긍정/부정 비율)를
//             GET /reports/:id/keywords 응답으로 교체
//             응답 형식 예시: { keywords: Keyword[], totalCount: number, positiveRatio: number, negativeRatio: number }
const KEYWORDS: Keyword[] = [
  { text: '집중력',     count: 28, isTop: true },
  { text: '불안',       count: 22 },
  { text: '긍정',       count: 18 },
  { text: '스트레스',   count: 15 },
  { text: '자기효능감', count: 12 },
];

const KEYWORD_STYLES = [
  { badge: 'bg-(--main-blue)/10 text-main-blue',   count: 'bg-main-blue/20 text-main-blue'   },
  { badge: 'bg-error-400/10 text-error-500',        count: 'bg-error-400/20 text-error-500'   },
  { badge: 'bg-success-700/10 text-success-700',    count: 'bg-success-700/20 text-success-700'},
  { badge: 'bg-warning-500/10 text-warning-600',    count: 'bg-warning-500/20 text-warning-600'},
  { badge: 'bg-prime-200/60 text-prime-600',        count: 'bg-prime-300/40 text-prime-600'   },
];

// TODO [API]: ACTIONS를 GET /reports/:id/actions 응답으로 교체
//             응답 형식 예시: [{ title: string, desc: string, duration: string }]
const ACTIONS = [
  {
    title: '꾸준한 루틴 유지',
    desc: '일정한 수면 패턴과 식사 시간을 지키는 것이 감정 안정에 도움이 됩니다.',
    duration: '매일 10분',
  },
  {
    title: '감정 표현 연습',
    desc: '일기 쓰기나 신뢰하는 사람과의 대화를 통해 감정을 외부로 표현해보세요.',
    duration: '주 3회 이상',
  },
];

const CARD = 'rounded-[24px] border border-prime-100 bg-white p-10 shadow-sm';

export function ReportDetail({ report, onPdfDownload }: ReportDetailProps) {
  // TODO [API]: buildChartData(report) → GET /reports/:id/chart-data 훅으로 교체
  const emotionData = buildChartData(report);

  return (
    <div className="space-y-8">
      {/* ── 리포트 헤더 ── */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 mb-8" style={{ animationDuration: '400ms' }}>
        <div className="mb-4 flex items-start justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span
                className={cn(
                  'inline-block rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide',
                  report.reportType === 'weekly'
                    ? 'text-main-blue bg-(--main-blue)/10'
                    : 'bg-prime-100 text-prime-600'
                )}
              >
                {report.type}
              </span>
              {report.isNew && (
                <span className="bg-success-700 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-white">
                  <Sparkles className="size-3" />
                  NEW
                </span>
              )}
            </div>
            <h1 className="text-prime-900 mb-3 text-[36px] font-bold tracking-tight">
              {report.title}
            </h1>
            <div className="text-prime-500 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span className="text-sm font-medium">분석 기간: {report.period}</span>
              </div>
              <span className="text-prime-200 hidden sm:block">|</span>
              <span className="text-sm font-medium">생성일: {report.date}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onPdfDownload}
            className="border-prime-200 text-prime-700 hover:bg-prime-100/50 flex h-14 shrink-0 items-center gap-2 rounded-3xl border bg-white px-8 text-sm font-bold shadow-sm transition-colors"
          >
            <Download className="size-4.5" />
            PDF 다운로드
          </button>
        </div>
      </div>

      {/* ── 감정 변화 그래프 (섹션 헤더 포함) ── */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDuration: '400ms', animationDelay: '80ms', animationFillMode: 'both' }}>
        <EmotionAreaChart data={emotionData} type={report.reportType ?? 'weekly'} />
      </div>

      {/* ── 주요 고민 키워드 ── */}
      <div className={`${CARD} animate-in fade-in-0 slide-in-from-bottom-4`} style={{ animationDuration: '400ms', animationDelay: '160ms', animationFillMode: 'both' }}>
        <div className="mb-8">
          <h3 className="text-prime-700 mb-3 text-2xl font-bold tracking-tight">
            주요 고민 키워드
          </h3>
          <p className="text-prime-500 text-[15px]">가장 빈번하게 언급된 감정 및 상황 키워드</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {KEYWORDS.map((kw, i) => {
            const style = KEYWORD_STYLES[i % KEYWORD_STYLES.length];
            return (
              <div
                key={kw.text}
                className={cn('flex items-center gap-3 rounded-3xl px-5 py-3.5 transition-all', style.badge)}
              >
                <span className="text-[15px] font-bold">#{kw.text}</span>
                <span className={cn('rounded-xl px-2.5 py-1 text-[13px] font-bold', style.count)}>
                  {kw.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* TODO [API]: 아래 통계 수치(95개, 32%, 68%)를 GET /reports/:id/keywords 응답값으로 교체 */}
        <div className="border-prime-100 mt-8 grid grid-cols-3 gap-6 border-t pt-8">
          {[
            { label: '총 키워드 수', value: '95개', color: 'text-prime-700' },
            { label: '긍정 키워드', value: '32%', color: 'text-success-700' },
            { label: '부정 키워드', value: '68%', color: 'text-error-500' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-prime-500 mb-2 text-[13px]">{label}</p>
              <p className={cn('text-2xl font-bold tracking-tight', color)}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 사용자 상태 요약 ── */}
      <div className={`${CARD} animate-in fade-in-0 slide-in-from-bottom-4`} style={{ animationDuration: '400ms', animationDelay: '240ms', animationFillMode: 'both' }}>
        <div className="mb-8">
          <h3 className="text-prime-700 mb-3 text-2xl font-bold tracking-tight">
            사용자 상태 요약
          </h3>
          <p className="text-prime-500 text-[15px]">AI 분석을 통한 현재 심리 상태 종합 평가</p>
        </div>

        {/* TODO [API]: 아래 상태 요약 텍스트 3개(전반적 상태/주요 발견사항/긍정적 변화)를
                       GET /reports/:id/summary 응답의 summary.overall / summary.findings / summary.positiveChange 필드로 교체 */}
        <div className="space-y-6">
          <div>
            <h4 className="text-prime-700 mb-3 text-base font-bold">전반적 상태</h4>
            <p className="text-prime-700 text-sm leading-relaxed">
              이번 주 전반적으로{' '}
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium">
                긍정적인 감정 지수
              </span>
              를 유지했습니다. 화요일에 일시적인 불안감이 포착되었으나, 목요일 이후 빠르게 회복되는
              경향을 보였습니다.
            </p>
          </div>
          <div>
            <h4 className="text-prime-700 mb-3 text-base font-bold">주요 발견사항</h4>
            <p className="text-prime-700 text-sm leading-relaxed">
              주말에는 감정 지수가 최고치를 기록하며{' '}
              <span className="rounded bg-blue-50 px-1.5 py-0.5 font-medium">심리적 안정</span>{' '}
              상태가 확인되었습니다. 전체적으로 지난 주 대비{' '}
              <span className="font-bold" style={{ color: 'var(--main-blue)' }}>
                +12점
              </span>{' '}
              향상되었습니다.
            </p>
          </div>
          <div>
            <h4 className="text-prime-700 mb-3 text-base font-bold">긍정적 변화</h4>
            <p className="text-prime-700 text-sm leading-relaxed">
              최근 3일간{' '}
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium">
                자기 돌봄 활동 빈도가 증가
              </span>
              하며 전반적인 감정 점수가 상승하는 긍정적 추세를 보이고 있습니다.
            </p>
          </div>
        </div>

        {/* TODO [API]: 스트레스 수준(label: '높음', value: 72)과 회복 탄력성(label: '양호', value: 65)을
                       GET /reports/:id/summary 응답의 summary.stressLevel / summary.resilience 필드로 교체
                       value는 0~100 사이 정수, label은 '낮음' | '보통' | '높음' | '양호' 등 */}
        <div className="border-prime-100 mt-8 grid grid-cols-2 gap-4 border-t pt-8">
          <div className="bg-bg-light rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-prime-500 text-[13px]">스트레스 수준</span>
              <span className="text-main-blue text-base font-bold">높음</span>
            </div>
            <div className="bg-prime-200 h-2 w-full overflow-hidden rounded-full">
              <div className="bg-main-blue h-full w-[72%] rounded-full" />
            </div>
          </div>
          <div className="bg-success-700/5 rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-prime-500 text-[13px]">회복 탄력성</span>
              <span className="text-success-700 text-base font-bold">양호</span>
            </div>
            <div className="bg-success-700/20 h-2 w-full overflow-hidden rounded-full">
              <div className="bg-success-700 h-full w-[65%] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 맞춤 행동 제언 ── */}
      <div className="bg-main-blue animate-in fade-in-0 slide-in-from-bottom-4 rounded-[24px] p-12 shadow-sm" style={{ animationDuration: '400ms', animationDelay: '320ms', animationFillMode: 'both' }}>
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Target className="size-8 text-white" />
          </div>
          <h3 className="text-prime-900 mb-3 text-[28px] font-bold tracking-tight">
            맞춤 행동 제언
          </h3>
          <p className="text-prime-900/70 text-[15px]">
            AI가 분석한 상태에 맞는 실천 가능한 액션 플랜
          </p>
        </div>

        <div className="space-y-4">
          {ACTIONS.map((action, i) => (
            <div
              key={action.title}
              className="rounded-4xl border border-white/20 bg-white/10 p-7 backdrop-blur-sm transition-all hover:bg-white/15"
            >
              <div className="flex items-start gap-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-lg font-bold text-white">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h4 className="text-[17px] font-bold text-white">{action.title}</h4>
                    <span className="shrink-0 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-medium text-white/70">
                      {action.duration}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">{action.desc}</p>
                </div>
                <button
                  type="button"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20"
                >
                  <CheckCircle className="size-5.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 면책 고지 ── */}
      <div className="border-prime-100 animate-in fade-in-0 border-t pt-8" style={{ animationDuration: '400ms', animationDelay: '400ms', animationFillMode: 'both' }}>
        <div className="bg-prime-100/40 rounded-[24px] p-7">
          <p className="text-prime-500 text-[13px] leading-relaxed">
            💡 이 리포트는 AI 분석을 기반으로 자동 생성되었습니다. 심리적 어려움이 지속되거나 심화될
            경우 전문가의 상담을 받으시길 권장합니다. 마인드 로그는 전문 의료 서비스를 대체하지
            않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
