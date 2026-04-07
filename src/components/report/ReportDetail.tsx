'use client';

import { addDays, format } from 'date-fns';
import { Calendar, Sparkles, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { getReportDetailApi, getReportSuggestionsApi } from '@/entities/reports/api';
import type { ReportDetailCompleted, SuggestionItem } from '@/entities/reports/model';
import { EmotionAreaChart } from './EmotionAreaChart';
import type { EmotionDataPoint } from './EmotionAreaChart';
import type { Report } from './types';

interface ReportDetailProps {
  report: Report;
}

// '2026.03.17 - 2026.03.23' 형식에서 시작일 파싱
function parsePeriodStart(period: string): Date {
  const startStr = period.split(' - ')[0]; // '2026.03.17'
  const [y, m, d] = startStr.split('.').map(Number);
  return new Date(y, m - 1, d);
}

// TODO [API]: GET /v1/reports/{report_id}/graphs 응답으로 그래프 데이터 로드
//             응답 형식: { graph_count, graphs: [{ session_id, avg_score, recorded_at }], graph_evaluation }
//             graphs 배열을 EmotionDataPoint[]로 변환하여 표시
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
      label: `${i + 1}회차`,
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
  isTop?: boolean;
}

// TODO [API]: KEYWORDS, 키워드 통계(총 키워드 수/긍정/부정 비율)를
//             GET /reports/:id/keywords 응답으로 교체
//             응답 형식 예시: { keywords: Keyword[], totalCount: number, positiveRatio: number, negativeRatio: number }
const KEYWORDS: Keyword[] = [
  { text: '집중력', isTop: true },
  { text: '불안' },
  { text: '긍정' },
  { text: '스트레스' },
  { text: '자기효능감' },
];

const KEYWORD_STYLES = [
  'bg-(--main-blue)/10 text-main-blue',
  'bg-error-400/10 text-error-500',
  'bg-success-700/10 text-success-700',
  'bg-warning-500/10 text-warning-600',
  'bg-prime-200/60 text-prime-600',
];

const CARD = 'rounded-[24px] border border-prime-100 bg-white p-10 shadow-sm';

export function ReportDetail({ report }: ReportDetailProps) {
  const emotionData = buildChartData(report);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true);
  const [tendencySummary, setTendencySummary] = useState<string | null>(null);
  const [isTendencyLoading, setIsTendencyLoading] = useState(true);

  useEffect(() => {
    getReportSuggestionsApi(report.id)
      .then(setSuggestions)
      .finally(() => setIsSuggestionsLoading(false));
  }, [report.id]);

  useEffect(() => {
    getReportDetailApi(report.id)
      .then((detail) => {
        if ('tendency_analysis' in detail) {
          setTendencySummary((detail as ReportDetailCompleted).tendency_analysis.tendency_summary);
        }
      })
      .finally(() => setIsTendencyLoading(false));
  }, [report.id]);

  return (
    <div className="space-y-8">
      {/* ── 리포트 헤더 ── */}
      <div
        className="animate-in fade-in-0 slide-in-from-bottom-4 mb-8"
        style={{ animationDuration: '400ms' }}
      >
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
        </div>
      </div>

      {/* ── 감정 변화 그래프 (섹션 헤더 포함) ── */}
      {/* TODO [API]: GET /v1/reports/{report_id}/graphs 응답으로 아래 emotionData 업데이트 필요 */}
      <div
        className="animate-in fade-in-0 slide-in-from-bottom-4"
        style={{ animationDuration: '400ms', animationDelay: '80ms', animationFillMode: 'both' }}
      >
        <EmotionAreaChart data={emotionData} type={report.reportType ?? 'weekly'} />
      </div>

      {/* ── 주요 고민 키워드 ── */}
      <div
        className={`${CARD} animate-in fade-in-0 slide-in-from-bottom-4`}
        style={{ animationDuration: '400ms', animationDelay: '160ms', animationFillMode: 'both' }}
      >
        <div className="mb-8">
          <h3 className="text-prime-700 mb-3 text-2xl font-bold tracking-tight">
            주요 고민 주제 및 키워드 분석
          </h3>
          <p className="text-prime-500 text-[15px]">
            반복적으로 등장한 고민 주제와 핵심 키워드를 분석했어요
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {KEYWORDS.map((kw, i) => (
            <div
              key={kw.text}
              className={cn(
                'flex items-center gap-3 rounded-3xl px-5 py-3.5 transition-all',
                KEYWORD_STYLES[i % KEYWORD_STYLES.length]
              )}
            >
              <span className="text-[15px] font-bold">#{kw.text}</span>
            </div>
          ))}
        </div>
        {/* 키워드 배지 아래에 추가 */}
        {/* TODO [API]: GET /reports/:id/keywords 응답의 topicSummary 필드로 교체 */}
        <p className="text-prime-600 mt-6 text-sm leading-relaxed">
          이번 기간 동안 반복적으로 등장한 주제는 ...
        </p>
      </div>

      {/* ── 사용자 상태 요약 ── */}
      <div
        className={`${CARD} animate-in fade-in-0 slide-in-from-bottom-4`}
        style={{ animationDuration: '400ms', animationDelay: '240ms', animationFillMode: 'both' }}
      >
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
            <h4 className="text-prime-700 mb-3 text-base font-bold">사용자 경향</h4>
            {isTendencyLoading ? (
              <div className="space-y-2">
                <div className="bg-prime-100 h-3.5 w-full animate-pulse rounded" />
                <div className="bg-prime-100 h-3.5 w-4/5 animate-pulse rounded" />
                <div className="bg-prime-100 h-3.5 w-3/5 animate-pulse rounded" />
              </div>
            ) : (
              <p className="text-prime-700 text-sm leading-relaxed">
                {tendencySummary ?? '경향 분석 데이터가 없어요.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── 맞춤 행동 제언 ── */}
      <div
        className="bg-main-blue animate-in fade-in-0 slide-in-from-bottom-4 rounded-[24px] p-12 shadow-sm"
        style={{ animationDuration: '400ms', animationDelay: '320ms', animationFillMode: 'both' }}
      >
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
          {isSuggestionsLoading ? (
            <>
              {[0, 1].map((i) => (
                <div key={i} className="rounded-4xl border border-white/20 bg-white/10 p-7">
                  <div className="flex items-start gap-5">
                    <div className="size-10 shrink-0 animate-pulse rounded-full bg-white/20" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-1/3 animate-pulse rounded bg-white/20" />
                      <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            suggestions.map((suggestion, i) => (
              <div
                key={suggestion.title}
                className="rounded-4xl border border-white/20 bg-white/10 p-7 backdrop-blur-sm transition-all hover:bg-white/15"
              >
                <div className="flex items-start gap-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-lg font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-3 text-[17px] font-bold text-white">{suggestion.title}</h4>
                    <p className="text-sm leading-relaxed text-white/90">{suggestion.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 면책 고지 ── */}
      <div
        className="border-prime-100 animate-in fade-in-0 border-t pt-8"
        style={{ animationDuration: '400ms', animationDelay: '400ms', animationFillMode: 'both' }}
      >
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
