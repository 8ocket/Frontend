'use client';

import { format } from 'date-fns';
import { Calendar, Sparkles, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  getReportSuggestionsApi,
  getReportTendencyApi,
  getReportGraphsApi,
  getReportKeywordsApi,
} from '@/entities/reports/api';
import type { SuggestionItem, AiReportTopicItem } from '@/entities/reports/model';
import { EmotionAreaChart } from './EmotionAreaChart';
import type { EmotionDataPoint } from './EmotionAreaChart';
import type { Report } from './types';

interface ReportDetailProps {
  report: Report;
}


const CARD = 'rounded-[24px] border border-prime-100 bg-white p-5 md:p-10 shadow-sm';

export function ReportDetail({ report }: ReportDetailProps) {
  const [emotionData, setEmotionData] = useState<EmotionDataPoint[]>([]);
  const [graphEvaluation, setGraphEvaluation] = useState<string | null>(null);
  const [isGraphLoading, setIsGraphLoading] = useState(true);
  const [keywords, setKeywords] = useState<AiReportTopicItem[]>([]);
  const [keywordsEvaluation, setKeywordsEvaluation] = useState<string | null>(null);
  const [isKeywordsLoading, setIsKeywordsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true);
  const [tendencySummary, setTendencySummary] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isTendencyLoading, setIsTendencyLoading] = useState(true);

  useEffect(() => {
    getReportGraphsApi(report.id)
      .then((res) => {
        const mapped: EmotionDataPoint[] = res.graphs.map((g, i) => {
          const score = g.avg_score;
          let emotion = '보통';
          if (score >= 50) emotion = '행복';
          else if (score >= 20) emotion = '안정';
          else if (score >= 0) emotion = '평온';
          else if (score >= -20) emotion = '피로';
          else emotion = '불안';

          const date = new Date(g.recorded_at);
          const label = report.reportType === 'weekly' ? `${i + 1}회차` : format(date, 'MM.dd');
          return { label, score, emotion };
        });
        setEmotionData(mapped);
        setGraphEvaluation(res.graph_evaluation);
      })
      .catch(() => setEmotionData([]))
      .finally(() => setIsGraphLoading(false));
  }, [report.id, report.reportType]);

  useEffect(() => {
    getReportKeywordsApi(report.id)
      .then((res) => {
        setKeywords(res.topics);
        setKeywordsEvaluation(res.topics_evaluation);
      })
      .catch(() => setKeywords([]))
      .finally(() => setIsKeywordsLoading(false));
  }, [report.id]);

  useEffect(() => {
    getReportSuggestionsApi(report.id)
      .then(setSuggestions)
      .finally(() => setIsSuggestionsLoading(false));
  }, [report.id]);

  useEffect(() => {
    getReportTendencyApi(report.id)
      .then((res) => {
        setTendencySummary(res.tendency);
        setCurrentStatus(res.current_status);
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
                    : 'bg-success-700/10 text-success-700'
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
            <h1 className="text-prime-900 mb-3 text-2xl font-bold tracking-tight md:text-[36px]">
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
      <div
        className="animate-in fade-in-0 slide-in-from-bottom-4"
        style={{ animationDuration: '400ms', animationDelay: '80ms', animationFillMode: 'both' }}
      >
        {isGraphLoading ? (
          <div className={CARD}>
            <div className="bg-prime-100 h-75 w-full animate-pulse rounded" />
          </div>
        ) : emotionData.length > 0 ? (
          <>
            <EmotionAreaChart data={emotionData} type={report.reportType ?? 'weekly'} />
            {graphEvaluation && (
              <p className="text-prime-600 mt-4 text-sm leading-relaxed">{graphEvaluation}</p>
            )}
          </>
        ) : (
          <div className={CARD}>
            <p className="text-prime-500 text-center text-sm">감정 그래프 데이터가 없어요.</p>
          </div>
        )}
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
          {isKeywordsLoading ? (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-prime-100 h-11 w-24 animate-pulse rounded-3xl" />
              ))}
            </>
          ) : keywords.length > 0 ? (
            keywords.map((kw) => (
              <div
                key={kw.name}
                className="bg-prime-100 text-prime-600 flex items-center gap-3 rounded-3xl px-5 py-3.5 transition-all"
              >
                <span className="text-[15px] font-bold">#{kw.name}</span>
              </div>
            ))
          ) : (
            <p className="text-prime-500 text-sm">키워드 데이터가 없어요.</p>
          )}
        </div>
        <p className="text-prime-600 mt-6 text-sm leading-relaxed">{keywordsEvaluation ?? ''}</p>
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

        <div className="space-y-6">
          <div>
            <h4 className="text-prime-700 mb-3 text-base font-bold">전반적 상태</h4>
            {isTendencyLoading ? (
              <div className="space-y-2">
                <div className="bg-prime-100 h-3.5 w-full animate-pulse rounded" />
                <div className="bg-prime-100 h-3.5 w-4/5 animate-pulse rounded" />
              </div>
            ) : (
              <p className="text-prime-700 text-sm leading-relaxed">
                {currentStatus ?? '상태 분석 데이터가 없어요.'}
              </p>
            )}
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
        className="animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col gap-10 rounded-[24px] p-6"
        style={{
          animationDuration: '400ms',
          animationDelay: '320ms',
          animationFillMode: 'both',
          background: 'rgba(130,201,255,0.1)',
        }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="flex size-12 items-center justify-center rounded-full"
            style={{ background: 'rgba(130,201,255,0.2)' }}
          >
            <Target className="size-6 text-prime-900" />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-prime-900 text-2xl font-semibold tracking-tight">
              맞춤 행동 제언
            </h3>
            <p className="text-prime-900 text-sm font-semibold">
              AI가 분석한 상태에 맞는 실천 가능한 액션 플랜
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {isSuggestionsLoading ? (
            <>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-3xl p-4 md:items-center md:gap-6 md:p-7"
                  style={{ background: 'rgba(130,201,255,0.2)' }}
                >
                  <div
                    className="size-11 shrink-0 animate-pulse rounded-full"
                    style={{ background: 'rgba(130,201,255,0.3)' }}
                  />
                  <div className="flex-1 space-y-4">
                    <div className="bg-prime-200 h-4 w-1/3 animate-pulse rounded" />
                    <div className="bg-prime-100 h-3 w-full animate-pulse rounded" />
                    <div className="bg-prime-100 h-3 w-4/5 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            suggestions.map((suggestion, i) => (
              <div
                key={suggestion.title}
                className="flex items-start gap-4 rounded-3xl p-4 md:items-center md:gap-6 md:p-7"
                style={{ background: 'rgba(130,201,255,0.2)' }}
              >
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(130,201,255,0.3)' }}
                >
                  <span className="text-prime-900 text-xl font-semibold">{i + 1}</span>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-prime-900 text-xl font-semibold leading-snug">
                    {suggestion.title}
                  </h4>
                  <p className="text-prime-900 text-base leading-relaxed">{suggestion.content}</p>
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
