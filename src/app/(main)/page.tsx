'use client';

import { format, getDate, getDaysInMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { EmotionCardFront, getEmotionDisplayName } from '@/widgets/emotion-card';
import { cn } from '@/shared/lib/utils';
import { MOCK_COLLECTION_CARDS } from '@/mocks/emotion';
import type { EmotionCardData } from '@/entities/emotion';
import { useAuthStore } from '@/entities/user/store';

const _today = new Date();
const TODAY_DATE = getDate(_today);
const DAYS_IN_MONTH = getDaysInMonth(_today);
const CALENDAR_DAYS = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);
const TODAY_LABEL = format(_today, 'yyyy. MM. dd', { locale: ko });
const TODAY_MONTH_LABEL = format(_today, 'yyyy.MM.dd', { locale: ko });

function getPrimaryEmotionLabel(card: EmotionCardData): string {
  const primary = card.layers.find((l) => l.role === 'primary');
  return primary ? getEmotionDisplayName(primary.type, null) : 'EMOTION';
}

// 출석 mock — API 연동 시 교체
const MOCK_ATTENDED = new Set([1, 2, 3, 5, 7, 9, 11]);

const REPORT_DESCRIPTION =
  '상담이 진행될 때마다 하루 단위로 분석된 내용은 저희의 데이터베이스에 저장되며, 이 내역은 마음기록에서 확인하실 수 있습니다. 저장된 내역은 철저한 보안에 의해 외부로부터 보호 받습니다. 이렇게 저장된 데이터를 모아서 주기적으로 분석하여 그 동안의 심리변화와 어떤 심리상태를 겪으셨는지, 그리고 이에 대한 행동지침 같은 정보를 모아 전문 리포트라는 별도의 형식으로 제공해 드립니다.\n\n이러한 전문 리포트는 주간, 월간 별로 구분되어 조회하실 수 있으며, 내용이 쌓일수록 더욱 더 고도화된 데이터를 구성하여 더 나은 사용자분의 심리적 안정을 추구하실 수 있게 됩니다. AI를 기반으로 상담이 진행되므로 초창기에는 적은 데이터를 통해 사용자분에게 한정적인 정보만을 제공하게 되지만, 정보가 쌓일수록 AI가 여러분들을 학습하게 되고 여러분들의 삶의 더 많은 가능성을 추구할 수 있게 됩니다.\n\n상담을 통해 사용자분의 상태를 진단하고, 전문 리포트를 통하여 생활을 바꾸어 나가시길 바랍니다.\n저희는 사용자분의 행복한 삶을 응원합니다.';

// ── 스켈레톤 플레이스홀더 ───────────────────────────────────────────────────
function ChartSkeleton({ label }: { label: string }) {
  return (
    <div className="flex h-38.5 flex-col items-center justify-center gap-2 rounded-xl bg-white">
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
    <div className="flex h-38.5 flex-col items-center justify-center gap-3 rounded-xl bg-white">
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {['감정', '스트레스', '관계', '업무'].map((kw) => (
          <span key={kw} className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-300">
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
      <div className="flex min-h-main-safe items-center justify-center">
        <div className="border-cta-300 h-8 w-8 animate-spin rounded-full border-b-2" />
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
    <div className="bg-secondary-100 min-h-main-safe">
      <div className="mx-auto max-w-360 px-4 sm:px-8 lg:px-10">
        {/* ── Section 1: 인사말 + 출석체크 ──────────────────────────────────── */}
        <section className="pt-6 pb-8">
          <h1 className="mb-6 text-[28px] leading-[1.3] font-semibold tracking-[-0.42px] text-[#1a222e] sm:text-[32px]">
            <span className="text-cta-300 underline">{userName}</span>
            <span>님, 오늘 하루는 어떠셨나요?</span>
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="text-prime-700 flex items-center gap-4 text-[12px] leading-[1.2] font-medium tracking-[-0.18px]">
                  <span>Today :</span>
                  <span>{TODAY_LABEL}</span>
                </div>

                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
                  {CALENDAR_DAYS.map((day) => {
                    const isToday = day === TODAY_DATE;
                    const isPast = day < TODAY_DATE;
                    const isAttended = MOCK_ATTENDED.has(day) && (isPast || isToday);
                    const isNearFuture = day > TODAY_DATE && day <= TODAY_DATE + 10;
                    const isFarFuture = day > TODAY_DATE + 10;
                    return (
                      <div
                        key={day}
                        title={isAttended ? `${day}일 출석 완료` : `${day}일`}
                        className={cn(
                          'relative flex size-6 shrink-0 items-center justify-center rounded-full text-[16px] leading-none font-medium',
                          isToday && 'bg-cta-300 text-[#f8fafc]',
                          !isToday && isAttended && 'bg-interactive-glass-blue-50 text-prime-700',
                          !isToday && !isAttended && isPast && 'text-prime-700 opacity-50',
                          isNearFuture && 'text-prime-700 opacity-50',
                          isFarFuture && 'text-prime-700 opacity-10'
                        )}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {MOCK_ATTENDED.has(TODAY_DATE) ? (
                <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
                  <Check className="text-cta-300 h-4 w-4" aria-hidden="true" />
                  오늘 출석 완료
                </div>
              ) : (
                <button
                  type="button"
                  className="bg-cta-300 shrink-0 rounded-lg px-6 py-3.5 text-base font-medium text-[#1a222e] transition-opacity hover:opacity-90"
                >
                  출석체크 하기
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[12px] leading-[1.2] tracking-[-0.18px]">
                <span className="text-[#10b981]">+이번 달에는 총 </span>
                <span className="text-cta-300">{MOCK_ATTENDED.size}</span>
                <span className="text-[#10b981]">회 방문 하셨습니다.</span>
              </p>
              <p className="text-[12px] leading-[1.2] tracking-[-0.18px] text-[#10b981]">
                +출석체크를 하실 때마다 3크레딧씩 드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: 이벤트 배너 ────────────────────────────────────────── */}
        <section className="relative mb-10 h-100 overflow-hidden rounded-3xl bg-[rgba(130,201,255,0.1)]">
          <div className="absolute top-10 left-10 flex items-center" style={{ height: 300 }}>
            {MOCK_COLLECTION_CARDS.slice(0, 8).map((card, idx) => {
              const emotionLabel = getPrimaryEmotionLabel(card);
              return (
                <div
                  key={card.cardId}
                  className="shrink-0"
                  style={{ position: 'relative', zIndex: idx, marginRight: idx < 7 ? -110 : 0 }}
                >
                  <EmotionCardFront
                    layers={card.layers}
                    emotionLabel={emotionLabel}
                    width={175}
                    height={300}
                  />
                </div>
              );
            })}
          </div>

          <div className="absolute top-0 right-10 bottom-0 hidden w-109.5 flex-col items-end justify-center gap-10 lg:flex">
            <div className="flex w-full flex-col items-end gap-6">
              <div className="flex w-full flex-col items-end gap-2">
                <p className="text-warning-500 w-full text-right text-[14px] font-medium tracking-[-0.21px]">
                  EVENT
                </p>
                <p className="text-prime-800 w-full text-right text-[24px] leading-[1.3] font-semibold tracking-[-0.36px]">
                  2026 감정카드 세트를 실제 카드로 만나보세요.
                </p>
              </div>
              <div className="text-prime-600 w-99.75 text-right text-[16px] leading-[1.6] font-normal">
                <p>나만의 감정 카드는 어쩌면 나의 정체성 그 자체일지도 모릅니다.</p>
                <p>그러한 카드를 가상의 카드가 아닌 실물로 소유해 보세요.</p>
                <p>신한, 국민, 우체국, 하나, 농협 등 시중은행에서 발급 가능합니다.</p>
                <p>한정판 이벤트로 조기에 마감될 수도 있습니다.</p>
              </div>
              <p className="text-error-300 w-99.75 text-right text-[12px] leading-[1.2] tracking-[-0.18px]">
                자세한 이벤트는 상세페이지에서 확인 부탁드립니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/shop')}
              className="bg-cta-300 overflow-hidden rounded-lg px-6 py-3.5 text-base font-medium text-[#1a222e] transition-opacity hover:opacity-90"
            >
              이벤트 보러 가기
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            <div className="h-2 w-8 rounded-full bg-[rgba(130,201,255,0.8)]" />
            <div className="h-2 w-2 rounded-full bg-[rgba(130,201,255,0.3)]" />
            <div className="h-2 w-2 rounded-full bg-[rgba(130,201,255,0.3)]" />
          </div>
        </section>

        {/* ── Section 3: 감정카드 ────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="mb-6 flex flex-col items-start">
            <h2 className="text-[24px] leading-[1.3] font-semibold tracking-[-0.36px] text-[#1a222e]">
              감정카드
            </h2>
            <p className="text-prime-700 text-[12px] leading-[1.2] font-normal tracking-[-0.18px]">
              최근 7건의 상담결과를 반영한 카드를 보여드립니다.
            </p>
          </div>

          <div className="relative">
            <div
              className="from-secondary-100 pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-linear-to-l to-transparent"
              aria-hidden="true"
            />
            <div
              ref={cardContainerRef}
              className="no-scrollbar flex items-end gap-6 overflow-x-auto pr-8 pb-4"
            >
              {MOCK_COLLECTION_CARDS.slice(0, visibleCount).map((card) => {
                const emotionLabel = getPrimaryEmotionLabel(card);
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
        <section className="mb-10">
          <div className="mb-4 flex flex-col items-end gap-2">
            <h2 className="text-right text-[24px] leading-[1.3] font-semibold tracking-[-0.36px] text-[#1a222e]">
              심화 리포트
            </h2>
            <p className="text-prime-700 max-w-90.75 text-right text-[12px] leading-[1.2] font-normal tracking-[-0.18px]">
              사용자분의 장기적인 상담 내역을 분석하여 자세한 정보를 드리는 컨텐츠입니다.
            </p>
          </div>

          <div className="flex w-full flex-col gap-8 lg:flex-row">
            <div className="w-full shrink-0 overflow-hidden rounded-3xl bg-[rgba(130,201,255,0.1)] p-4 backdrop-blur-[25px] lg:w-[52%]">
              <div className="mb-4 flex items-start justify-between">
                <p className="text-[32px] leading-[1.3] font-semibold tracking-[-0.48px] text-[#1a222e]">
                  심화 리포트
                </p>
                <div className="flex flex-col items-end gap-2 text-[12px] leading-[1.2] text-[#1a222e]">
                  <p>형식 구분 : 월간</p>
                  <p>기준 일자 : {TODAY_MONTH_LABEL}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <p className="text-prime-800 mb-2 text-[16px] leading-[1.3] font-semibold tracking-[-0.24px]">
                    1. 월간 감정 그래프
                  </p>
                  <ChartSkeleton label="감정 그래프" />
                </div>
                <div className="flex-1">
                  <p className="text-prime-800 mb-2 text-[16px] leading-[1.3] font-semibold tracking-[-0.24px]">
                    2. 주요 고민 주제 및 키워드 분석
                  </p>
                  <KeywordSkeleton />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-prime-800 mb-2 text-[16px] leading-[1.3] font-semibold tracking-[-0.24px]">
                  3. 상담 기반 사용자 성향 분석
                </p>
                <div className="h-60 overflow-hidden">
                  <p className="text-prime-500 text-[14px] leading-[1.6]">
                    AI 분석을 통해 사용자분의 감정 패턴과 심리적 성향을 분석합니다. 지속적인 상담을
                    통해 더욱 정확한 분석이 가능합니다. 매일 꾸준한 기록을 권장드립니다. 상담
                    데이터가 쌓일수록 더 세밀한 성향 분석을 제공해드릴 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[14px] leading-[1.3] font-semibold tracking-[-0.21px] text-[#1a222e]">
                  4. AI 맞춤형 행동 제언
                </p>
                <div className="h-42.25 overflow-hidden">
                  <p className="text-prime-500 text-[14px] leading-[1.6]">
                    사용자분의 상담 데이터를 바탕으로 AI가 분석한 맞춤형 행동 제언입니다. 지속적인
                    상담을 통해 더 정확한 분석이 가능합니다. 매일 꾸준한 기록을 권장드립니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 lg:pl-2">
              <p className="text-prime-500 text-right text-[16px] leading-[1.6] font-normal whitespace-pre-line">
                {REPORT_DESCRIPTION}
              </p>
              <p className="text-error-400 text-right text-[12px] leading-[1.2] tracking-[-0.18px]">
                전문 리포트는 유료 서비스로 결제가 필요한 서비스입니다.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/report')}
                  className="bg-cta-300 overflow-hidden rounded-lg px-6 py-3.5 text-base font-medium text-[#1a222e] transition-opacity hover:opacity-90"
                >
                  전문 리포트 보러가기
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Floating AI 상담 버튼 ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => router.push('/chat')}
        className="bg-cta-300 fixed right-6 bottom-6 z-50 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 sm:right-8 sm:bottom-8"
        style={{ width: 110, height: 110 }}
        aria-label="AI 상담 받으러 가기"
      >
        <span className="text-prime-700 text-center text-[14px] leading-none font-medium whitespace-pre-line">
          {'AI 상담\n받으러 가기'}
        </span>
        <MessageCircle className="mt-1 h-12 w-12 text-[#1a222e]" aria-hidden="true" />
      </button>
    </div>
  );
}
