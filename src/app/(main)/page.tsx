'use client';

import { format, getDate, getDaysInMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { EmotionCardFront, getEmotionDisplayName } from '@/widgets/emotion-card';
import { cn } from '@/shared/lib/utils';
import { MOCK_COLLECTION_CARDS } from '@/mocks/emotion';
import { useAuthStore } from '@/entities/user/store';

// ── Figma: 대시보드(홈) — 1675:3805 ─────────────────────────────────────────

const today = new Date();
const TODAY_DATE = getDate(today);
const DAYS_IN_MONTH = getDaysInMonth(today);
const TODAY_LABEL = format(today, 'yyyy. MM. dd', { locale: ko });
const TODAY_MONTH_LABEL = format(today, 'yyyy.MM.dd', { locale: ko });

// 출석 mock — API 연동 시 교체
const MOCK_ATTENDED = new Set([1, 2, 3, 5, 7, 9, 11]);

const REPORT_DESCRIPTION =
  '매일의 상담 데이터를 AI가 분석해 월간 감정 흐름, 주요 키워드, 성향 분석, 맞춤형 행동 제언을 제공합니다. 꾸준한 상담일수록 더 정확한 리포트를 받아보실 수 있습니다.';

const DISCLAIMER =
  '본 심화 리포트는 AI 분석 기반의 참고 자료로, 전문 의료 서비스를 대체하지 않습니다. 정신 건강 문제가 있을 경우 반드시 전문 의료기관을 방문하시기 바랍니다.';

const LOREM_LONG =
  '사용자의 상담 데이터를 바탕으로 AI가 분석한 맞춤형 행동 제언입니다. 지속적인 상담을 통해 더 정확한 분석이 가능합니다. 매일 꾸준한 기록을 권장드립니다.';

// ── 스켈레톤 플레이스홀더 ───────────────────────────────────────────────────
function ChartSkeleton({ label }: { label: string }) {
  return (
    <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4-4 4 4 4-6 4 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18" />
      </svg>
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <span className="text-[11px] text-slate-300">상담 기록이 쌓이면 자동으로 표시됩니다</span>
    </div>
  );
}

function KeywordSkeleton() {
  return (
    <div className="flex h-36 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50">
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {['감정', '스트레스', '관계', '업무'].map((kw) => (
          <span
            key={kw}
            className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-300"
          >
            {kw}
          </span>
        ))}
      </div>
      <span className="text-xs font-medium text-slate-400">주요 키워드 분석</span>
      <span className="text-[11px] text-slate-300">상담 기록이 쌓이면 자동으로 표시됩니다</span>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, setLoading } = useAuthStore();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardContainerWidth, setCardContainerWidth] = useState(0);

  useEffect(() => {
    if (!cardContainerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setCardContainerWidth(entry.contentRect.width);
    });
    ro.observe(cardContainerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#82c9ff]" />
      </div>
    );
  }

  const userName = user?.name ?? 'USER NAME';

  // 감정카드 반응형 — 컨테이너 너비에 따라 카드 수와 크기 계산
  const getCardDimensions = (cw: number) => {
    const gap = 24;
    const calcWidth = (n: number) => Math.floor((cw - gap * (n - 1)) / n);
    if (cw < 500) {
      const w = calcWidth(2);
      return { cardWidth: w, cardHeight: Math.round((w * 300) / 175), visibleCount: 2 };
    }
    if (cw < 700) {
      const w = calcWidth(3);
      return { cardWidth: w, cardHeight: Math.round((w * 300) / 175), visibleCount: 3 };
    }
    if (cw < 900) {
      const w = calcWidth(4);
      return { cardWidth: w, cardHeight: Math.round((w * 300) / 175), visibleCount: 4 };
    }
    if (cw < 1100) {
      const w = calcWidth(5);
      return { cardWidth: w, cardHeight: Math.round((w * 300) / 175), visibleCount: 5 };
    }
    if (cw < 1300) {
      const w = calcWidth(6);
      return { cardWidth: w, cardHeight: Math.round((w * 300) / 175), visibleCount: 6 };
    }
    return { cardWidth: 175, cardHeight: 300, visibleCount: 7 };
  };
  const { cardWidth, cardHeight, visibleCount } = getCardDimensions(cardContainerWidth);

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">

        {/* ── Section 1: 인사말 ──────────────────────────────────────────────── */}
        <div className="mb-6 pt-2">
          <h1 className="text-[28px] leading-[1.3] font-semibold tracking-[-0.42px] text-[#1a222e] sm:text-[32px]">
            <span className="text-[#82c9ff] underline">{userName}</span>
            <span>님, 오늘 하루는 어떠셨나요?</span>
          </h1>
        </div>

        {/* ── Section 2: 출석 체크 카드 ─────────────────────────────────────── */}
        <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1a222e]">출석 체크</h2>
            {MOCK_ATTENDED.has(TODAY_DATE) ? (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#82c9ff]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                오늘 출석 완료
              </div>
            ) : (
              <button
                type="button"
                className="rounded-lg bg-[#82c9ff] px-4 py-2 text-sm font-medium text-[#1a222e] transition-opacity hover:opacity-90"
              >
                출석체크 하기
              </button>
            )}
          </div>

          {/* 날짜 스트립 */}
          <p className="mb-2 text-xs font-normal tracking-[-0.18px] text-[#3f526f]">
            Today : {TODAY_LABEL}
          </p>
          <div className="no-scrollbar flex items-center gap-[6px] overflow-x-auto pb-2">
            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
              const day = i + 1;
              const isToday = day === TODAY_DATE;
              const isPast = day < TODAY_DATE;
              const isNearFuture = day > TODAY_DATE && day <= TODAY_DATE + 10;
              const isFarFuture = day > TODAY_DATE + 10;
              const isAttended = MOCK_ATTENDED.has(day) && (isPast || isToday);

              return (
                <div
                  key={day}
                  title={isAttended ? `${day}일 출석 완료` : `${day}일`}
                  className={cn(
                    'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-medium transition-colors',
                    isToday && 'bg-[#82c9ff] text-[#1a222e] ring-2 ring-[#82c9ff] ring-offset-1',
                    !isToday && isAttended && 'bg-[rgba(130,201,255,0.35)] text-[#3f526f]',
                    !isToday && !isAttended && isPast && 'text-slate-300',
                    isNearFuture && 'text-slate-400',
                    isFarFuture && 'text-slate-200'
                  )}
                >
                  {isAttended && !isToday ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-[#82c9ff]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-label={`${day}일 출석 완료`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    day
                  )}
                </div>
              );
            })}
          </div>

          {/* 출석 통계 */}
          <div className="mt-3 flex flex-col gap-0.5">
            <p className="text-xs leading-[1.4]">
              <span className="text-[#10b981]">이번 달에는 총 </span>
              <span className="font-semibold text-[#82c9ff]">{MOCK_ATTENDED.size}회</span>
              <span className="text-[#10b981]"> 방문하셨습니다.</span>
            </p>
            <p className="text-xs leading-[1.4] text-[#10b981]">
              출석체크를 하실 때마다 3크레딧씩 드립니다.
            </p>
          </div>
        </section>

        {/* ── Section 3: 감정카드 ───────────────────────────────────────────── */}
        <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1a222e]">감정카드</h2>
          <p className="mt-1 text-xs font-normal tracking-[-0.18px] text-[#3f526f]">
            최근 7건의 상담결과를 반영한 카드를 보여드립니다.
          </p>

          <div className="relative mt-6">
            {/* 오른쪽 fade — 스크롤 가능 힌트 */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" aria-hidden="true" />
          <div ref={cardContainerRef} className="flex items-end gap-6 overflow-x-auto pb-4 pr-8">
            {MOCK_COLLECTION_CARDS.slice(0, visibleCount).map((card) => {
              const primaryLayer = card.layers.find((l) => l.role === 'primary');
              const emotionLabel = primaryLayer
                ? getEmotionDisplayName(primaryLayer.type, null)
                : 'EMOTION';
              return (
                <button
                  key={card.cardId}
                  type="button"
                  onClick={() => router.push('/collection')}
                  className="shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                  aria-label={`${emotionLabel} 감정카드 — 마음기록 모음 보기`}
                >
                  <EmotionCardFront
                    layers={card.layers}
                    emotionLabel={emotionLabel}
                    width={cardWidth || 175}
                    height={cardHeight || 300}
                  />
                </button>
              );
            })}
          </div>
          </div>
        </section>

        {/* ── Section 4: 심화 리포트 ────────────────────────────────────────── */}
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-1 sm:items-end">
            <h2 className="text-lg font-semibold text-[#1a222e] sm:text-right">심화 리포트</h2>
            <p className="max-w-[420px] text-xs font-normal tracking-[-0.18px] text-[#3f526f] sm:text-right">
              사용자분의 장기적인 상담 내역을 분석하여 자세한 정보를 드리는 컨텐츠입니다.
            </p>
          </div>

          <div className="flex w-full flex-col gap-8 lg:flex-row">
            {/* 왼쪽 — 리포트 프리뷰 카드 */}
            <div className="w-full shrink-0 overflow-hidden rounded-2xl bg-[rgba(130,201,255,0.08)] p-5 lg:w-[52%]">
              {/* 카드 헤더 */}
              <div className="mb-4 flex items-start justify-between">
                <p className="text-xl font-semibold text-[#1a222e]">심화 리포트</p>
                <div className="flex flex-col items-end gap-0.5">
                  <p className="text-xs text-[#3f526f]">형식 구분 : 월간</p>
                  <p className="text-xs text-[#3f526f]">기준 일자 : {TODAY_MONTH_LABEL}</p>
                </div>
              </div>

              {/* 항목 1, 2 — 나란히 */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <p className="mb-2 text-[14px] font-semibold tracking-[-0.21px] text-[#1a222e]">
                    1. 월간 감정 그래프
                  </p>
                  <ChartSkeleton label="감정 그래프" />
                </div>
                <div className="flex-1">
                  <p className="mb-2 text-[14px] font-semibold tracking-[-0.21px] text-[#1a222e]">
                    2. 주요 고민 주제 및 키워드
                  </p>
                  <KeywordSkeleton />
                </div>
              </div>

              {/* 항목 3 */}
              <div className="mt-4">
                <p className="mb-1.5 text-[14px] font-semibold tracking-[-0.21px] text-[#1a222e]">
                  3. 상담 기반 사용자 성향 분석
                </p>
                <div className="h-6 w-3/4 rounded bg-slate-100" />
                <div className="mt-1.5 h-6 w-1/2 rounded bg-slate-100" />
              </div>

              {/* 항목 4 */}
              <div className="mt-4">
                <p className="mb-1.5 text-[14px] font-semibold tracking-[-0.21px] text-[#1a222e]">
                  4. AI 맞춤형 행동 제언
                </p>
                <p className="line-clamp-4 text-[13px] leading-[1.6] text-[#3f526f]">
                  {LOREM_LONG}
                </p>
              </div>
            </div>

            {/* 오른쪽 — 설명 + 버튼 */}
            <div className="flex flex-1 flex-col justify-between gap-6 lg:pl-2">
              <div>
                <p className="max-w-[60ch] text-[14px] leading-[1.7] text-[#3f526f]">
                  {REPORT_DESCRIPTION}
                </p>
                <p className="mt-4 max-w-[60ch] text-[12px] leading-[1.6] font-normal text-slate-400">
                  {DISCLAIMER}
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/report')}
                className="w-fit rounded-lg bg-[#82c9ff] px-6 py-3 text-[15px] font-medium text-[#1a222e] transition-opacity hover:opacity-90"
              >
                전문 리포트 보러가기
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── Floating AI 상담 버튼 ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => router.push('/chat')}
        className="fixed right-6 bottom-6 z-50 flex flex-col items-center justify-center gap-1 rounded-full bg-[#82c9ff] shadow-lg transition-transform hover:scale-105 active:scale-95 sm:right-8 sm:bottom-8"
        style={{ width: 72, height: 72 }}
        aria-label="AI 상담 받으러 가기"
      >
        {/* 채팅 버블 아이콘 */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a222e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.847L3 20l1.09-3.27C3.4 15.56 3 13.82 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-[11px] font-semibold leading-none text-[#1a222e]">AI 상담</span>
      </button>
    </div>
  );
}
