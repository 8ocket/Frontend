'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { CalendarIcon, CheckCircle2, Info } from 'lucide-react';
import { format, addDays, min } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';
import type { ReportType } from './types';
import { REPORT_CREDIT_COST } from '@/constants/credit';
import { getSessionsApi } from '@/entities/session/api';

interface ReportCreationFormProps {
  onCreateReport: (type: ReportType, startDate: string, endDate: string) => void;
}

export function ReportCreationForm({ onCreateReport }: ReportCreationFormProps) {
  const [selectedType, setSelectedType] = useState<ReportType>('weekly');
  const [baseDate, setBaseDate] = useState<Date | undefined>(undefined);
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);
  const [agreed, setAgreed] = useState(false);
  const [consultationCount, setConsultationCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const today = useMemo(() => {
    const next = new Date();
    next.setHours(0, 0, 0, 0);
    return next;
  }, []);

  // 기준 날짜로부터 종료일 자동 계산 (오늘 이후 불가)
  const autoEndDate = useMemo(() => {
    if (!baseDate) return undefined;
    const days = selectedType === 'weekly' ? 6 : 30;
    return min([addDays(baseDate, days), today]);
  }, [baseDate, selectedType, today]);

  // 달력에 표시할 범위 (호버 미리보기 우선, 그 다음 확정 선택)
  const displayRange = useMemo<DateRange | undefined>(() => {
    if (hoverDate) {
      const days = selectedType === 'weekly' ? 6 : 30;
      return { from: hoverDate, to: min([addDays(hoverDate, days), today]) };
    }
    if (baseDate && autoEndDate) return { from: baseDate, to: autoEndDate };
    return undefined;
  }, [baseDate, autoEndDate, hoverDate, selectedType, today]);

  const handleCalendarSelect = useCallback((range: DateRange | undefined) => {
    if (range?.from) setBaseDate(range.from);
  }, []);

  // 확정된 선택 날짜 마커 (hover 미리보기 중에도 유지)
  const confirmedModifiers = useMemo(
    () => (baseDate ? { confirmed: [baseDate] } : {}),
    [baseDate]
  );

  // baseDate / autoEndDate 변경 시 기간 내 세션 수 조회
  useEffect(() => {
    if (!baseDate || !autoEndDate) return;

    (async () => {
      setIsLoadingCount(true);
      try {
        const res = await getSessionsApi({
          start_date: format(baseDate, 'yyyy-MM-dd'),
          end_date: format(autoEndDate, 'yyyy-MM-dd'),
          size: 1,
        });
        setConsultationCount(res.pagination.total_count);
      } catch {
        setConsultationCount(null);
      } finally {
        setIsLoadingCount(false);
      }
    })();
  }, [baseDate, autoEndDate]);

  // 날짜 미선택 시 null로 취급
  const effectiveCount = baseDate && autoEndDate ? consultationCount : null;

  const minRequired = selectedType === 'weekly' ? 2 : 4;
  const hasEnough = (effectiveCount ?? 0) >= minRequired;
  const canGenerate = hasEnough && !!baseDate && agreed;

  const handleGenerate = () => {
    if (canGenerate && baseDate && autoEndDate) {
      onCreateReport(
        selectedType,
        format(baseDate, 'yyyy-MM-dd'),
        format(autoEndDate, 'yyyy-MM-dd')
      );
    }
  };

  const handleTypeChange = (type: ReportType) => {
    setSelectedType(type);
    setBaseDate(undefined);
  };

  const buttonLabel = () => {
    if (!baseDate) return '날짜를 먼저 선택해주세요';
    if (isLoadingCount) return '대화 기록 확인 중...';
    if (!hasEnough) return '이 기간엔 대화 기록이 조금 더 필요해요';
    if (!agreed) return '아래 동의 후 시작할 수 있어요';
    return '내 마음 리포트 확인하기';
  };

  return (
    <div className="space-y-5">
      {/* 유형 선택 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(['weekly', 'monthly'] as const).map((type) => {
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={cn(
                'relative rounded-2xl border-2 p-5 text-left transition-all duration-200',
                isSelected
                  ? 'border-main-blue bg-(--main-blue)/5 shadow-sm'
                  : 'border-prime-100 hover:border-prime-200 bg-white'
              )}
            >
              {isSelected && (
                <CheckCircle2 className="text-main-blue absolute top-4 right-4 size-5" />
              )}
              <span
                className={cn(
                  'mb-2 block text-[10px] font-bold tracking-widest uppercase',
                  isSelected ? 'text-main-blue' : 'text-prime-400'
                )}
              >
                {type === 'weekly' ? 'Weekly' : 'Monthly'}
              </span>
              <p className="text-prime-900 text-base font-bold">
                {type === 'weekly' ? '주간 리포트' : '월간 리포트'}
              </p>
              <p className="text-prime-500 mt-0.5 text-xs">
                {type === 'weekly' ? '2번' : '4번'} 이상 대화한 기간을 선택해요
              </p>
              <span
                className={cn(
                  'mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
                  isSelected ? 'bg-main-blue/15 text-main-blue' : 'bg-prime-100 text-prime-400'
                )}
              >
                {REPORT_CREDIT_COST[type]}C
              </span>
            </button>
          );
        })}
      </div>

      {/* 기준 날짜 선택 + 자동 설정 기간 표시 */}
      <div className="border-prime-100 rounded-2xl border bg-white p-5">
        <label className="text-prime-800 mb-3 block text-sm font-semibold">
          어느 기간을 살펴볼까요?
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex h-11 w-full items-center justify-between rounded-xl border px-3 text-sm transition-colors',
                'border-prime-200 bg-bg-light hover:border-main-blue',
                !baseDate && 'text-prime-400'
              )}
            >
              <span>
                {baseDate && autoEndDate
                  ? `${format(baseDate, 'yyyy.MM.dd', { locale: ko })} – ${format(autoEndDate, 'yyyy.MM.dd', { locale: ko })}`
                  : '분석 시작일을 선택해주세요'}
              </span>
              <CalendarIcon className="text-prime-400 size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={displayRange}
              onSelect={handleCalendarSelect}
              onDayMouseEnter={(day) => setHoverDate(day)}
              onDayMouseLeave={() => setHoverDate(undefined)}
              disabled={(d) => d > today}
              modifiers={confirmedModifiers}
              modifiersClassNames={{ confirmed: 'bg-main-blue text-white rounded-md' }}
              autoFocus
            />
          </PopoverContent>
        </Popover>

        <p className="text-prime-400 mt-2 text-xs">
          {selectedType === 'weekly'
            ? '선택하신 날부터 일주일간의 변화를 세밀하게 분석해 드려요.'
            : '선택하신 날부터 한 달간의 마음 흐름을 꼼꼼하게 살펴볼게요.'}
        </p>
      </div>

      {/* 상담 횟수 현황 */}
      <div
        className={cn(
          'flex items-center justify-between rounded-xl p-4',
          !baseDate || isLoadingCount
            ? 'bg-bg-light'
            : hasEnough
              ? 'bg-bg-light'
              : 'bg-error-100/60'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2">
            <CalendarIcon
              className={cn(
                'size-4',
                !baseDate || isLoadingCount
                  ? 'text-prime-300'
                  : hasEnough
                    ? 'text-main-blue'
                    : 'text-error-500'
              )}
            />
          </div>
          <div>
            <p className="text-prime-900 text-sm font-semibold">
              {!baseDate
                ? '날짜를 선택하면 확인할 수 있어요'
                : isLoadingCount
                  ? '대화 기록을 확인하는 중이에요...'
                  : hasEnough
                    ? `이 기간에 ${effectiveCount}번의 대화가 있었네요 😊`
                    : `이 기간엔 대화 기록이 조금 더 필요해요`}
            </p>
            <p className="text-prime-500 mt-0.5 text-xs">
              {!baseDate
                ? '기간을 설정하면 대화 기록 수를 알려드릴게요.'
                : isLoadingCount
                  ? '잠시만 기다려 주세요.'
                  : hasEnough
                    ? '분석하기 딱 좋은 데이터예요!'
                    : `${minRequired}번 이상 대화한 기간을 선택해 주세요.`}
            </p>
          </div>
        </div>
        {baseDate && !isLoadingCount && (
          <span
            className={cn('text-sm font-bold', hasEnough ? 'text-main-blue' : 'text-error-500')}
          >
            {hasEnough ? '준비됐어요 ✓' : '기록 부족'}
          </span>
        )}
      </div>

      {/* 이용 동의 */}
      <label className="flex cursor-pointer items-start gap-3">
        <button
          type="button"
          onClick={() => setAgreed(!agreed)}
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
            agreed ? 'border-main-blue bg-main-blue' : 'border-prime-300 bg-white'
          )}
        >
          {agreed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="#1a222e"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <span className="text-prime-700 text-sm leading-snug">
          크레딧 사용 및 AI 마음 분석에{' '}
          <span className="text-prime-900 font-semibold">동의해요.</span>
          <span className="text-prime-400 ml-1 text-xs">(전문 의료 서비스를 대체하지 않아요)</span>
        </span>
      </label>

      {/* 생성 버튼 */}
      <Button
        onClick={handleGenerate}
        disabled={!baseDate || isLoadingCount || !hasEnough || !agreed}
        size="cta"
        className="h-12 text-base"
      >
        {buttonLabel()}
      </Button>

      {/* 안내 문구 */}
      <div className="text-prime-400 flex items-center gap-2">
        <Info className="size-3.5 shrink-0" />

        <p className="text-xs">상담 종료 후 생성된 감정 카드를 기반으로 리포트가 분석됩니다.</p>
      </div>
    </div>
  );
}
