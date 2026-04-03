'use client';

import { format, getDate, getDaysInMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, MessageCircle, FileText, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { EmotionCardFront, getEmotionDisplayName } from '@/widgets/emotion-card';
import { cn } from '@/shared/lib/utils';
import { MOCK_COLLECTION_CARDS } from '@/mocks/emotion';
import type { EmotionCardData } from '@/entities/emotion';
import { useAuthStore } from '@/entities/user/store';
import { getReportListApi } from '@/entities/reports/api';
import type { CanGenerate } from '@/entities/reports/model';

// ── 날짜 상수 ────────────────────────────────────────────────────────────────
const _today = new Date();
const TODAY_DATE = getDate(_today);
const DAYS_IN_MONTH = getDaysInMonth(_today);
const TODAY_LABEL = format(_today, 'yyyy. MM. dd', { locale: ko });
const TODAY_MONTH_LABEL = format(_today, 'yyyy.MM.dd', { locale: ko });

// 현재 주차 7일 (월요일 시작)
const _dayOfWeek = _today.getDay(); // 0=Sun
const _mondayOffset = _dayOfWeek === 0 ? -6 : 1 - _dayOfWeek;
const WEEK_START = TODAY_DATE + _mondayOffset;
const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => WEEK_START + i);
const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;

// ── mock — API 연동 시 교체 ──────────────────────────────────────────────────
const MOCK_ATTENDED = new Set([1, 2, 3, 5, 7, 9, 11]);

const BANNER_IMAGES = [
  '/images/banner/banner1.svg',
  '/images/banner/banner2.svg',
  '/images/banner/banner3.svg',
];

function getPrimaryEmotionLabel(card: EmotionCardData): string {
  const primary = card.layers.find((l) => l.role === 'primary');
  return primary ? getEmotionDisplayName(primary.type, null) : 'EMOTION';
}

// ── 히어로 위젯: 심화 리포트 달성률 ─────────────────────────────────────────
function ReportProgressWidget({ progress, sessions, goal, eligible, onViewReport }: {
  progress: number;
  sessions: number;
  goal: number;
  eligible: boolean;
  onViewReport: () => void;
}) {
  const [displayed, setDisplayed] = useState(0);
  const isComplete = eligible;

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
    <div className="order-1 flex flex-col gap-6 rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:order-2 sm:flex-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cta-300" aria-hidden="true" />
          <h3 className="text-[15px] font-semibold text-[#1a222e]">심화 리포트 달성률</h3>
        </div>
        <span className="text-[11px] text-slate-400">{TODAY_MONTH_LABEL}</span>
      </div>

      {/* 수치 강조 */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className={cn(
            'text-[56px] font-bold leading-none tabular-nums tracking-tight',
            isComplete ? 'text-cta-300' : 'text-[#1a222e]'
          )}>
            {displayed}<span className="text-[28px] font-semibold">%</span>
          </span>
          <span className="text-[13px] text-slate-400">월간 진행률</span>
        </div>

        {/* 상담 횟수 병기 */}
        <div className="flex flex-col items-end gap-1 pb-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold tabular-nums text-[#1a222e]">{sessions}</span>
            <span className="text-[15px] text-slate-400">/ {goal}회</span>
          </div>
          <span className="text-[11px] text-slate-400">목표 달성까지 {goal - sessions}회 남음</span>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="flex flex-col gap-2">
        <div className="relative h-5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-16 ease-linear',
              isComplete ? 'bg-cta-300' : 'bg-blue-400'
            )}
            style={{ width: `${displayed}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          {/* 트랙 마커 */}
          {Array.from({ length: goal - 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-white/60"
              style={{ left: `${((i + 1) / goal) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-300">
          <span>0회</span>
          <span>{Math.floor(goal / 2)}회</span>
          <span>{goal}회</span>
        </div>
      </div>

      {/* CTA 버튼 */}
      <button
        type="button"
        onClick={isComplete ? onViewReport : undefined}
        disabled={!isComplete}
        className={cn(
          'mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-semibold transition-all',
          isComplete
            ? 'bg-cta-300 cursor-pointer text-[#1a222e] hover:opacity-90'
            : 'cursor-not-allowed border-2 border-dashed border-blue-200 bg-blue-50/60 text-blue-300'
        )}
      >
        {!isComplete && <Lock className="h-4 w-4" aria-hidden="true" />}
        {isComplete ? '리포트 확인하기' : `${goal - sessions}회 상담 후 리포트 열람 가능`}
      </button>
    </div>
  );
}

// ── 서브 위젯: 출석 현황 (이번 주 도장판) ────────────────────────────────────
function AttendanceWidget() {
  const [todayDone, setTodayDone] = useState(MOCK_ATTENDED.has(TODAY_DATE));
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAttendance = () => {
    if (todayDone) return;
    setIsAnimating(true);
    setTimeout(() => {
      setTodayDone(true);
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className="order-2 flex flex-col gap-5 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:order-1 sm:flex-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-cta-300" aria-hidden="true" />
          <h3 className="text-[15px] font-semibold text-[#1a222e]">출석 현황</h3>
        </div>
        <span className="text-[11px] text-slate-400">{TODAY_LABEL}</span>
      </div>

      {/* 이번 주 도장판 */}
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_DAYS.map((day, i) => {
          const isToday = day === TODAY_DATE;
          const isValid = day >= 1 && day <= DAYS_IN_MONTH;
          const isAttended = isValid && (MOCK_ATTENDED.has(day) || (isToday && todayDone));
          const isPast = isValid && day < TODAY_DATE;
          const isFuture = !isValid || day > TODAY_DATE;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className={cn(
                'text-[10px] font-medium',
                isToday ? 'text-cta-300' : 'text-slate-400'
              )}>
                {WEEK_LABELS[i]}
              </span>
              <div className={cn(
                'flex h-10 w-full items-center justify-center rounded-xl transition-all duration-300',
                isToday && isAttended && 'bg-cta-300 scale-105 shadow-sm',
                isToday && !isAttended && 'bg-cta-300/20 ring-2 ring-cta-300 ring-offset-1',
                !isToday && isAttended && 'bg-blue-100',
                !isToday && isPast && !isAttended && 'bg-slate-100',
                isFuture && !isToday && 'bg-slate-50 opacity-40',
              )}>
                {isAttended ? (
                  <Check className={cn(
                    'h-4 w-4 transition-all duration-300',
                    isToday ? 'text-[#1a222e]' : 'text-blue-400'
                  )} />
                ) : (
                  <span className={cn(
                    'text-[13px] font-semibold tabular-nums',
                    isToday ? 'text-cta-300' : 'text-slate-300'
                  )}>
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
        <p className="text-[12px] leading-snug text-slate-500">
          이번 달{' '}
          <span className="font-bold text-cta-300">{todayDone ? MOCK_ATTENDED.size : MOCK_ATTENDED.size}회</span>
          {' '}방문 · 출석 시 3크레딧
        </p>

        {todayDone ? (
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400">
            <Check className="h-3.5 w-3.5 text-cta-300" />
            오늘 출석 완료
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAttendance}
            className={cn(
              'bg-cta-300 shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-[#1a222e] transition-all hover:opacity-90',
              isAnimating && 'scale-90 opacity-70'
            )}
          >
            출석체크
          </button>
        )}
      </div>
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
              idx === current ? 'h-2 w-7 bg-[rgba(130,201,255,0.9)]' : 'h-2 w-2 bg-[rgba(130,201,255,0.4)]'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, setLoading } = useAuthStore();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardContainerWidth, setCardContainerWidth] = useState(0);
  const [canGenerate, setCanGenerate] = useState<CanGenerate | null>(null);

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

  useEffect(() => {
    getReportListApi().then((res) => setCanGenerate(res.can_generate)).catch(() => {});
  }, []);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-main-safe items-center justify-center">
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
    <div className="bg-secondary-100 min-h-main-safe">
      <div className="mx-auto max-w-360 px-4 sm:px-8 lg:px-10">

        {/* ── 헤더: 인사말 ─────────────────────────────────────────────────── */}
        <section className="pt-6 pb-5">
          <h1 className="text-[26px] leading-[1.3] font-semibold tracking-[-0.42px] text-[#1a222e] sm:text-[30px]">
            <span className="text-cta-300 underline">{userName}</span>
            <span>님, 오늘 하루는 어떠셨나요?</span>
          </h1>
        </section>

        {/* ── 코어 지표: 리포트(히어로) + 출석(서브) ────────────────────────── */}
        <section className="mb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <ReportProgressWidget
              sessions={canGenerate?.saved_session_count ?? 0}
              goal={canGenerate?.required_session_count ?? 1}
              progress={canGenerate ? Math.round((canGenerate.saved_session_count / canGenerate.required_session_count) * 100) : 0}
              eligible={canGenerate?.eligible ?? false}
              onViewReport={() => router.push('/report')}
            />
            <AttendanceWidget />
          </div>
        </section>

        {/* ── 광고 띠 배너 ──────────────────────────────────────────────────── */}
        <section className="mb-8">
          <AdBanner />
        </section>

        {/* ── 감정카드 섹션 ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="text-[20px] leading-[1.3] font-semibold tracking-[-0.3px] text-[#1a222e]">
              감정카드
            </h2>
            <p className="text-prime-700 text-[12px] font-normal tracking-[-0.18px]">
              최근 7건의 상담 결과
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
