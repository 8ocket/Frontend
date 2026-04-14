'use client';

import { format, getDate, getDaysInMonth, getDay, startOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, FileText, Lock, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { EmotionCardFront, getEmotionDisplayName } from '@/widgets/emotion-card';
import { cn } from '@/shared/lib/utils';
import type { EmotionCardData } from '@/entities/emotion';
import { getCollectionCardsApi } from '@/entities/emotion/api';
import { useAuthStore } from '@/entities/user/store';
import { getReportListApi } from '@/entities/reports/api';
import type { CanGenerate } from '@/entities/reports/model';
import { getAttendanceApi } from '@/entities/attendance/api';

// ── 날짜 상수 ────────────────────────────────────────────────────────────────
const _today = new Date();
const TODAY_DATE = getDate(_today);
const DAYS_IN_MONTH = getDaysInMonth(_today);
const TODAY_LABEL = format(_today, 'yyyy. MM. dd', { locale: ko });

// 현재 주차 7일 (월요일 시작)
const _dayOfWeek = _today.getDay(); // 0=Sun
const _mondayOffset = _dayOfWeek === 0 ? -6 : 1 - _dayOfWeek;
const WEEK_START = TODAY_DATE + _mondayOffset;
const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => WEEK_START + i);
const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;

const BANNER_IMAGES = [
  '/images/banner/banner1.svg',
  '/images/banner/banner2.svg',
  '/images/banner/banner3.svg',
];

function getPrimaryEmotionLabel(card: EmotionCardData): string {
  const primary = card.layers.find((l) => l.role === 'primary');
  return primary ? getEmotionDisplayName(primary.type, null) : 'EMOTION';
}

// ── 주간 리포트 달성률 위젯 ──────────────────────────────────────────────────
function WeeklyReportWidget({
  sessions,
  goal,
  eligible,
  onViewReport,
}: {
  sessions: number;
  goal: number;
  eligible: boolean;
  onViewReport: () => void;
}) {
  const progress = goal > 0 ? Math.round((sessions / goal) * 100) : 0;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(progress / 60));
    const timer = setInterval(() => {
      current = Math.min(current + step, progress);
      setDisplayed(current);
      if (current >= progress) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [progress]);

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="text-cta-300 h-4 w-4" aria-hidden="true" />
          <h3 className="text-[14px] font-semibold text-[#1a222e]">주간 리포트 달성률</h3>
        </div>
        <span className="text-prime-400 text-[11px]">{TODAY_LABEL}</span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-cta-300 text-[44px] leading-none font-bold tracking-tight tabular-nums">
          {displayed}
          <span className="text-[22px] font-semibold">%</span>
        </span>
        <span className="text-prime-400 pb-1 text-[13px] font-medium">
          {sessions} / {goal}회
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="bg-cta-400 h-full rounded-full transition-[width] duration-16 ease-linear"
            style={{ width: `${displayed}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={eligible ? onViewReport : undefined}
        disabled={!eligible}
        className={cn(
          'mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold transition-all',
          eligible
            ? 'bg-cta-300 text-prime-900 cursor-pointer hover:opacity-90'
            : 'border-cta-200 bg-cta-100 text-cta-500 cursor-not-allowed border-2 border-dashed font-medium'
        )}
      >
        {!eligible && <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
        {eligible ? '리포트 확인하기' : `리포트 생성까지 ${goal - sessions}회 남았어요!`}
      </button>
    </div>
  );
}

// ── 월간 리포트 달성률 위젯 ──────────────────────────────────────────────────
function MonthlyReportWidget({
  progress,
  sessions,
  goal,
  eligible,
  onViewReport,
}: {
  progress: number;
  sessions: number;
  goal: number;
  eligible: boolean;
  onViewReport: () => void;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(progress / 60));
    const timer = setInterval(() => {
      current = Math.min(current + step, progress);
      setDisplayed(current);
      if (current >= progress) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [progress]);

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="text-cta-300 h-4 w-4" aria-hidden="true" />
          <h3 className="text-[14px] font-semibold text-[#1a222e]">월간 리포트 달성률</h3>
        </div>
        <span className="text-prime-400 text-[11px]">{TODAY_LABEL}</span>
      </div>

      <div className="flex items-end gap-2">
        <span
          className={cn(
            'text-[44px] leading-none font-bold tracking-tight tabular-nums',
            'text-cta-300'
          )}
        >
          {displayed}
          <span className="text-[22px] font-semibold">%</span>
        </span>
        <span className="text-prime-400 pb-1 text-[13px] font-medium">
          {sessions} / {goal}회
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="bg-cta-400 h-full rounded-full transition-[width] duration-16 ease-linear"
            style={{ width: `${displayed}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-prime-400 text-[11px]">
          {eligible ? '리포트 열람 가능' : `목표까지 ${goal - sessions}회 남음`}
        </p>
      </div>

      <button
        type="button"
        onClick={eligible ? onViewReport : undefined}
        disabled={!eligible}
        className={cn(
          'mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold transition-all',
          eligible
            ? 'bg-cta-300 cursor-pointer text-[#1a222e] hover:opacity-90'
            : 'border-cta-200 bg-cta-100/60 text-cta-300 cursor-not-allowed border-2 border-dashed'
        )}
      >
        {!eligible && <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
        {eligible ? '리포트 확인하기' : '리포트 열람 불가'}
      </button>
    </div>
  );
}

// ── 서브 위젯: 출석 현황 ─────────────────────────────────────────────────────
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_COLORS = ['text-red-400', 'text-prime-300', 'text-prime-300', 'text-prime-300', 'text-prime-300', 'text-prime-300', 'text-blue-400'];
const FIRST_DAY_OFFSET = getDay(startOfMonth(_today));

function AttendanceWidget() {
  const [expanded, setExpanded] = useState(false);
  const yearMonth = format(_today, 'yyyy-MM');
  const { data: attendedDates = new Set<number>(), isError: loadError } = useQuery({
    queryKey: ['attendance', yearMonth],
    queryFn: () => getAttendanceApi(yearMonth),
    select: (res) => new Set(res.attendanceDates.map((d) => parseInt(d.split('-')[2], 10))),
  });

  const todayDone = attendedDates.has(TODAY_DATE);

  const monthlyCells: (number | null)[] = [
    ...Array(FIRST_DAY_OFFSET).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="text-cta-300 h-4 w-4" aria-hidden="true" />
          <h3 className="text-[15px] font-semibold text-[#1a222e]">
            <span className="text-cta-300">{format(_today, 'M월', { locale: ko })}</span> 출석 현황
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="bg-cta-50 text-cta-300 hover:bg-cta-100 border-cta-200 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
        >
          {expanded ? '접기' : '이번 달 전체 보기'}
        </button>
      </div>

      {loadError ? (
        <p className="text-prime-400 py-6 text-center text-xs">출석 정보를 불러오지 못했습니다.</p>
      ) : expanded ? (
        /* ── 월간 캘린더 ── */
        <div>
          <div className="mb-2 grid grid-cols-7">
            {DAY_LABELS.map((d, i) => (
              <span
                key={d}
                className={cn(
                  'py-1 text-center text-xs font-medium',
                  DAY_COLORS[i]
                )}
              >
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1.5">
            {monthlyCells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const isToday = day === TODAY_DATE;
              const isAttended = attendedDates.has(day);
              const col = (FIRST_DAY_OFFSET + day - 1) % 7;
              return (
                <div key={day} className="flex items-center justify-center py-0.5">
                  <div
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
                      isAttended && isToday && 'bg-cta-300 text-white shadow-sm',
                      isAttended && !isToday && 'bg-cta-100 text-cta-400',
                      !isAttended && isToday && 'ring-cta-300 text-cta-300 font-bold ring-2',
                      !isAttended && !isToday && col === 0 && 'text-red-400',
                      !isAttended && !isToday && col === 6 && 'text-blue-400',
                      !isAttended && !isToday && col !== 0 && col !== 6 && 'text-prime-500'
                    )}
                  >
                    {isAttended ? <Check size={14} strokeWidth={2.5} /> : day}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-prime-100 mt-4 flex items-center justify-between border-t pt-4">
            <p className="text-prime-500 text-[12px]">
              이번 달 <span className="text-cta-300 font-bold">{attendedDates.size}회</span> 출석
            </p>
            <span className="text-prime-300 text-xs">
              {DAYS_IN_MONTH}일 중 {attendedDates.size}일
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* 이번 주 도장판 */}
          <div className="grid grid-cols-7 gap-1.5">
            {WEEK_DAYS.map((day, i) => {
              const isToday = day === TODAY_DATE;
              const isValid = day >= 1 && day <= DAYS_IN_MONTH;
              const isAttended = isValid && attendedDates.has(day);
              const isPast = isValid && day < TODAY_DATE;
              const isFuture = !isValid || day > TODAY_DATE;

              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      isToday ? 'text-cta-400' : 'text-prime-400'
                    )}
                  >
                    {WEEK_LABELS[i]}
                  </span>
                  <div
                    className={cn(
                      'flex h-10 w-full items-center justify-center rounded-xl transition-all duration-300',
                      isToday && isAttended && 'bg-cta-300 scale-105 shadow-sm',
                      isToday && !isAttended && 'bg-cta-300/20 ring-cta-300 ring-2 ring-offset-1',
                      !isToday && isAttended && 'bg-cta-200',
                      !isToday && isPast && !isAttended && 'bg-neutral-400',
                      isFuture && !isToday && 'bg-neutral-300 opacity-60'
                    )}
                  >
                    {isAttended ? (
                      <Check
                        className={cn(
                          'h-4 w-4 transition-all duration-300',
                          isToday ? 'text-prime-900' : 'text-cta-400'
                        )}
                      />
                    ) : (
                      <span
                        className={cn(
                          'text-[13px] font-semibold tabular-nums',
                          isToday ? 'text-cta-300' : 'text-prime-300'
                        )}
                      >
                        {isValid ? day : ''}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 하단 */}
          <div className="mt-auto flex items-center justify-between gap-3">
            <p className="text-prime-500 text-[12px] leading-snug">
              이번 달 <span className="text-cta-300 font-bold">{attendedDates.size}회</span> 방문 ·
              출석 시 3크레딧
            </p>
            {todayDone ? (
              <div className="text-prime-400 flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-200 px-3 py-2 text-xs font-semibold">
                <Check className="text-cta-300 h-3.5 w-3.5" />
                오늘 출석 완료
              </div>
            ) : (
              <div className="text-prime-400 flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-200 px-3 py-2 text-xs font-semibold">
                출석 대기 중
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── 광고 띠 배너 ─────────────────────────────────────────────────────────────
function AdBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm">
      {BANNER_IMAGES.map((src, idx) => (
        <div
          key={src}
          className={cn(
            'relative transition-opacity duration-700',
            idx === current ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
          )}
        >
          <Image
            src={src}
            alt={`이벤트 배너 ${idx + 1}`}
            width={1200}
            height={400}
            className="w-full"
            unoptimized
            priority={idx === 0}
          />
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {BANNER_IMAGES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`배너 ${idx + 1}번으로 이동`}
            className={cn(
              'rounded-full transition-all duration-300',
              idx === current
                ? 'h-2 w-7 bg-[rgba(130,201,255,0.9)]'
                : 'h-2 w-2 bg-[rgba(130,201,255,0.4)]'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  const cardSectionRef = useRef<HTMLElement>(null);
  const [cardContainerWidth, setCardContainerWidth] = useState(0);
  const [cardContainer, setCardContainer] = useState<HTMLDivElement | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  const { data: reportData, isError: reportLoadError } = useQuery({
    queryKey: ['homeReports'],
    queryFn: () => Promise.all([getReportListApi(), getReportListApi('weekly')]),
    select: ([monthlyRes, weeklyRes]) => ({
      canGenerate: monthlyRes.can_generate,
      weeklyCanGenerate: weeklyRes.can_generate,
    }),
  });
  const canGenerate = reportData?.canGenerate ?? null;
  const weeklyCanGenerate = reportData?.weeklyCanGenerate ?? null;

  const { data: collectionCards = [] } = useQuery({
    queryKey: ['collectionCards'],
    queryFn: getCollectionCardsApi,
  });

  useEffect(() => {
    if (!cardContainer) return;
    const ro = new ResizeObserver(([entry]) => {
      setCardContainerWidth(entry.contentRect.width);
    });
    ro.observe(cardContainer);
    return () => ro.disconnect();
  }, [cardContainer]);

  useEffect(() => {
    const el = cardSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCardsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-main-safe flex items-center justify-center">
        <div className="border-cta-300 h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  const userName = user?.name ?? 'USER NAME';

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
    <div className="bg-secondary-100 min-h-screen w-full overflow-x-hidden">
      <div className="mx-auto max-w-360 px-4 sm:px-8 lg:px-10">
        {/* ── 헤더: 인사말 ─────────────────────────────────────────────────── */}
        <section className="pt-6 pb-5">
          <h1 className="text-[26px] leading-[1.3] font-semibold tracking-[-0.42px] text-[#1a222e] sm:text-[30px]">
            <span className="text-cta-300 underline">{userName}</span>
            <span>님, 오늘 하루는 어떠셨나요?</span>
          </h1>
        </section>

        {/* ── 출석 체크 ─────────────────────────────────────────────────────── */}
        <section className="mb-4">
          <AttendanceWidget />
        </section>

        {/* ── 광고 띠 배너 ──────────────────────────────────────────────────── */}
        <section className="mb-8">
          <AdBanner />
        </section>

        {/* ── 주간 달성률 | 월간 달성률 ────────────────────────────────────── */}
        <section className="mb-4">
          {reportLoadError && (
            <p className="mb-2 text-center text-xs text-red-400">
              리포트 정보를 불러오지 못했습니다. 새로고침 해주세요.
            </p>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <WeeklyReportWidget
              sessions={weeklyCanGenerate?.saved_session_count ?? 0}
              goal={weeklyCanGenerate?.required_session_count ?? 1}
              eligible={weeklyCanGenerate?.eligible ?? false}
              onViewReport={() => router.push('/report')}
            />
            <MonthlyReportWidget
              sessions={canGenerate?.saved_session_count ?? 0}
              goal={canGenerate?.required_session_count ?? 1}
              progress={
                canGenerate && canGenerate.required_session_count > 0
                  ? Math.round(
                      (canGenerate.saved_session_count / canGenerate.required_session_count) * 100
                    )
                  : 0
              }
              eligible={canGenerate?.eligible ?? false}
              onViewReport={() => router.push('/report')}
            />
          </div>
        </section>

        {/* ── 감정카드 섹션 ─────────────────────────────────────────────────── */}
        <section ref={cardSectionRef} className="mb-4">
          <div className="flex flex-col gap-4 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="text-cta-300 h-4 w-4" aria-hidden="true" />
                <h2 className="text-[14px] font-semibold text-[#1a222e]">감정카드</h2>
              </div>
              <span className="text-prime-400 text-[11px]">최근 7건의 상담 결과</span>
            </div>

            <div className="relative">
              <div
                className="from-secondary-100 pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-linear-to-l to-transparent"
                aria-hidden="true"
              />
              <div
                ref={setCardContainer}
                className="no-scrollbar scroll-snap-type-x-mandatory flex items-end gap-4 overflow-x-auto pr-8 pb-1"
              >
                {collectionCards.slice(0, visibleCount).map((card, index) => {
                  const emotionLabel = getPrimaryEmotionLabel(card);
                  return (
                    <button
                      key={card.cardId}
                      type="button"
                      onClick={() => router.push('/collection')}
                      style={{
                        transitionDelay: `${index * 80}ms`,
                        opacity: cardsVisible ? 1 : 0,
                        transform: cardsVisible ? 'translateY(0)' : 'translateY(14px)',
                      }}
                      className="scroll-snap-align-start shrink-0 cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95"
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
          </div>
        </section>
      </div>
      {/* ── Floating AI 상담 버튼 ─────────────────────────────────────────────── */}
      <div
        className="fixed right-6 bottom-10 z-50 sm:right-8 sm:bottom-12"
        style={{ width: 'clamp(80px, 20vw, 110px)', height: 'clamp(80px, 20vw, 110px)' }}
      >
        {/* 글로우 레이어 */}
        <div
          className="bg-cta-300/50 absolute inset-0 animate-pulse rounded-full blur-xl"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => router.push('/chat')}
          className="relative h-full w-full overflow-hidden rounded-full transition-transform hover:scale-105 active:scale-95"
          aria-label="AI 상담 받으러 가기"
        >
          <Image
            src="/images/icons/aichatbtn.png"
            alt="AI 상담 받으러 가기"
            fill
            sizes="110px"
            className="object-cover"
          />
        </button>
      </div>
    </div>
  );
}
