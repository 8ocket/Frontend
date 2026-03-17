'use client';

import { format, getDate, getDaysInMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { EmotionCardFront, getEmotionDisplayName } from '@/components/emotion';
import { cn } from '@/lib/utils';
import { getCookie } from '@/lib/utils/cookie';
import { MOCK_COLLECTION_CARDS } from '@/mocks/emotion';
import { useAuthStore } from '@/stores/auth';

// ── Figma: 대시보드(홈) — 1675:3805 ─────────────────────────────────────────

const today = new Date();
const TODAY_DATE = getDate(today);
const DAYS_IN_MONTH = getDaysInMonth(today);
const TODAY_LABEL = format(today, 'yyyy. MM. dd', { locale: ko });
const TODAY_MONTH_LABEL = format(today, 'yyyy.MM.dd', { locale: ko });

// 출석 mock — API 연동 시 교체
const MOCK_ATTENDED = new Set([1, 2, 3, 5, 7, 9, 11]);

// Plutchik 복합 감정 8종 — 배너 좌측 팬 카드용

// ── Footer nav ───────────────────────────────────────────────────────────────
// ── Lorem ipsum filler text ───────────────────────────────────────────────────
const LOREM_LONG =
  '상담이 진행될 때마다 하루 단위로 분석된 내용은 저희의 데이터베이스에 저장되며, 이 내역은 마음기록에서 확인하실 수 있습니다. 저장된 내역은 철저한 보안에 의해 외부로부터 보호 받습니다. 이렇게 저장된 데이터를 모아서 주기적으로 분석하여 사용자에게 심층적인 리포트를 제공합니다. 리포트는 월간, 분기 단위로 제공되며, 감정 변화 추이, 주요 고민 키워드 분석 등 다양한 통계를 담고 있습니다.';

const LOREM_SHORT =
  '본 심화 리포트는 AI 분석 기반의 참고 자료로, 전문 의료 서비스를 대체하지 않습니다. 정신 건강 문제가 있을 경우 반드시 전문 의료기관을 방문하시기 바랍니다.';

const LOREM_AI =
  '사용자의 상담 데이터를 바탕으로 AI가 분석한 맞춤형 행동 제언입니다. 지속적인 상담을 통해 더 정확한 분석이 가능합니다. 매일 꾸준한 기록을 권장드립니다.';

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
    const token = getCookie('accessToken');
    if (!token) {
      setLoading(false);
      router.push('/login');
      return;
    }
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
    <div className="min-h-screen bg-white dark:bg-[#1a222e]">
      {/* ── Section 1: Welcome Banner — Figma 1675:3805 ──────────────────────── */}
      <section className="dark:bg-[#2c3a4f]">
        <div className="mx-auto max-w-[1440px] px-8 pt-[8px] pb-6">
          {/* 인사말 */}
          <h1
            className="text-[32px] leading-[1.3] font-semibold tracking-[-0.48px] text-[#1a222e] dark:text-white"
            style={{ marginTop: 8 }}
          >
            <span className="text-[#82c9ff] underline">{userName}</span>
            <span>님, 오늘 하루는 어떠셨나요?</span>
          </h1>

          {/* 날짜 스트립 */}
          <div className="mt-[14px] flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="shrink-0 text-[12px] font-normal tracking-[-0.18px] text-[#3f526f] dark:text-[#a7b4be]">
              Today : {TODAY_LABEL}
            </span>
            <div className="no-scrollbar flex items-center gap-[8px] overflow-x-auto">
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
                    className={cn(
                      'flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full text-[16px] font-medium text-[#3f526f] transition-colors dark:text-[#a7b4be]',
                      isToday && 'bg-[#82c9ff] !text-[#1a222e]',
                      !isToday && isAttended && 'bg-[rgba(130,201,255,0.4)]',
                      isNearFuture && 'opacity-50',
                      isFarFuture && 'opacity-10'
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 출석 통계 */}
          <div className="mt-[8px] flex flex-col gap-0.5">
            <p className="text-[12px] leading-[1.2] font-normal tracking-[-0.18px]">
              <span className="text-[#10b981]">+이번 달에는 총 </span>
              <span className="text-[#82c9ff]">{MOCK_ATTENDED.size}</span>
              <span className="text-[#10b981]">회 방문 하셨습니다.</span>
            </p>
            <p className="text-[12px] leading-[1.2] font-normal tracking-[-0.18px] text-[#10b981]">
              +출석체크를 하실 때마다 3크레딧씩 드립니다.
            </p>
          </div>

          {/* 출석체크 버튼 */}
          <button
            type="button"
            className="mt-[8px] rounded-[8px] bg-[#82c9ff] px-[24px] py-[14px] text-[16px] font-medium text-[#1a222e] transition-opacity hover:opacity-90"
          >
            출석체크 하기
          </button>
        </div>
      </section>

      {/* ── Section 2: 배너 ───────────────────────────────────────────────────── */}
      <section className="mt-10">
        <div className="mx-auto max-w-360 px-8">
          <div className="flex h-100 items-center justify-center rounded-[24px] bg-[rgba(130,201,255,0.1)]">
            <div className="flex flex-col items-center gap-2">
              <p className="text-warning-500 text-[14px] font-medium tracking-[-0.21px]">
                Coming Soon
              </p>
              <p className="text-prime-600 dark:text-tertiary-300 text-[16px] font-normal">
                곧 찾아올 새로운 소식을 기대해 주세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: 감정카드 — Figma 1675:3982 ───────────────────────────── */}
      <section className="mx-auto mt-[150px] max-w-[1440px] px-8">
        <p className="text-[24px] leading-[1.3] font-semibold tracking-[-0.36px] text-[#1a222e] dark:text-white">
          감정카드
        </p>
        <p className="mt-1 text-[12px] font-normal tracking-[-0.18px] text-[#3f526f] dark:text-[#a7b4be]">
          최근 7건의 상담결과를 반영한 카드를 보여드립니다.
        </p>

        <div ref={cardContainerRef} className="mt-[24px] flex items-end gap-[24px] pb-4">
          {MOCK_COLLECTION_CARDS.slice(0, visibleCount).map((card) => {
            const primaryLayer = card.layers.find((l) => l.role === 'primary');
            const emotionLabel = primaryLayer
              ? getEmotionDisplayName(primaryLayer.type, null)
              : 'EMOTION';
            return (
              <div key={card.cardId} className="shrink-0">
                <EmotionCardFront
                  layers={card.layers}
                  emotionLabel={emotionLabel}
                  width={cardWidth || 175}
                  height={cardHeight || 300}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: 심화 리포트 — Figma 1675:4118 ────────────────────────── */}
      <section className="mx-auto mt-[150px] max-w-[1440px] px-4 sm:px-8">
        {/* 헤더 (우측 정렬) */}
        <div className="flex flex-col items-end gap-[8px]">
          <p className="text-right text-[24px] leading-[1.3] font-semibold tracking-[-0.36px] text-[#1a222e] dark:text-white">
            심화 리포트
          </p>
          <p className="max-w-90.75 text-right text-[12px] font-normal tracking-[-0.18px] text-prime-700 dark:text-tertiary-300">
            사용자분의 장기적인 상담 내역을 분석하여 자세한 정보를 드리는 컨텐츠입니다.
          </p>
        </div>

        {/* 콘텐츠 row */}
        <div className="mt-[16px] flex w-full flex-col items-start gap-8 lg:flex-row lg:gap-0">
          {/* 왼쪽 카드 */}
          <div className="w-full shrink-0 overflow-hidden rounded-[24px] bg-[rgba(130,201,255,0.1)] p-4 backdrop-blur-[25px] lg:w-183">
            {/* 상단 헤더 */}
            <div className="flex items-start justify-between">
              <p className="text-[32px] font-semibold text-[#1a222e] dark:text-white">
                심화 리포트
              </p>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[12px] font-normal text-[#1a222e] dark:text-[#a7b4be]">
                  형식 구분 : 월간
                </p>
                <p className="text-[12px] font-normal text-[#1a222e] dark:text-[#a7b4be]">
                  기준 일자 : {TODAY_MONTH_LABEL} 기준
                </p>
              </div>
            </div>

            {/* 항목 1, 2 — 나란히 */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              {/* 항목 1 — 월간 감정 그래프 */}
              <div className="flex-1">
                <p className="text-[16px] font-semibold tracking-[-0.24px] text-prime-800 dark:text-white">
                  1. 월간 감정 그래프
                </p>
                <div className="mt-2 h-38.5 rounded-xl bg-white/80" />
              </div>

              {/* 항목 2 — 주요 고민 주제 */}
              <div className="flex-1 sm:max-w-57.5">
                <p className="text-[16px] font-semibold tracking-[-0.24px] text-prime-800 dark:text-white">
                  2. 주요 고민 주제 및 키워드 분석
                </p>
                <div className="mt-2 h-38.5 rounded-xl bg-white/80" />
              </div>
            </div>

            {/* 항목 3 — 사용자 성향 분석 */}
            <div className="mt-4">
              <p className="text-[16px] font-semibold tracking-[-0.24px] text-prime-800 dark:text-white">
                3. 상담 기반 사용자 성향 분석
              </p>
              <p className="mt-2 line-clamp-10 text-[14px] leading-[1.6] font-normal text-prime-500">
                {LOREM_LONG}
              </p>
            </div>

            {/* 항목 4 — AI 맞춤형 행동 제언 */}
            <div className="mt-4">
              <p className="text-[14px] font-semibold tracking-[-0.21px] text-[#1a222e] dark:text-white">
                4. AI 맞춤형 행동 제언
              </p>
              <p className="mt-2 line-clamp-8 text-[14px] leading-[1.6] font-normal text-prime-500">
                {LOREM_AI}
              </p>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="w-full lg:flex-1 lg:pl-8">
            <p className="text-[16px] leading-[1.6] font-normal text-prime-500">
              {LOREM_LONG}
            </p>
            <p className="mt-3 text-[12px] font-normal text-[#ef4444]">{LOREM_SHORT}</p>
            <button
              type="button"
              onClick={() => router.push('/report')}
              className="mt-8 rounded-[8px] bg-[#82c9ff] px-[24px] py-[14px] text-[16px] font-medium text-[#1a222e] transition-opacity hover:opacity-90"
            >
              전문 리포트 보러가기
            </button>
          </div>
        </div>
      </section>

      {/* ── Floating AI 상담 버튼 ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => router.push('/chat')}
        className={cn(
          'fixed right-8 bottom-8 z-50 flex items-center justify-center rounded-full bg-[#82c9ff] text-center transition-opacity hover:opacity-90'
        )}
        style={{ width: 110, height: 110 }}
        aria-label="AI 상담 받으러 가기"
      >
        <span className="text-[14px] leading-[1.4] font-medium whitespace-pre-line text-[#3f526f]">
          {'AI 상담\n받으러 가기'}
        </span>
      </button>
    </div>
  );
}
