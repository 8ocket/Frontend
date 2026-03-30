'use client';

import { useState, useMemo } from 'react';
import { CalendarIcon, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { format, addDays, min } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';
import type { ReportType } from './types';
import { REPORT_CREDIT_COST } from '@/constants/credit';

interface ReportCreationFormProps {
  onCreateReport: (type: ReportType, startDate: string, endDate: string) => void;
  consultationCount: number;
}

export function ReportCreationForm({ onCreateReport, consultationCount }: ReportCreationFormProps) {
  const [selectedType, setSelectedType] = useState<ReportType>('weekly');
  const [baseDate, setBaseDate] = useState<Date | undefined>(undefined);
  const [agreed, setAgreed] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 기준 날짜로부터 종료일 자동 계산 (오늘 이후 불가)
  const autoEndDate = useMemo(() => {
    if (!baseDate) return undefined;
    const days = selectedType === 'weekly' ? 6 : 30;
    return min([addDays(baseDate, days), today]);
  }, [baseDate, selectedType, today]);

  const minRequired = selectedType === 'weekly' ? 2 : 4;
  const hasEnough = consultationCount >= minRequired;
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
                {baseDate ? format(baseDate, 'yyyy.MM.dd', { locale: ko }) : '분석을 시작할 날짜'}
              </span>
              <CalendarIcon className="text-prime-400 size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={baseDate}
              onSelect={setBaseDate}
              disabled={(d) => d > today}
              autoFocus
            />
          </PopoverContent>
        </Popover>

        {/* 자동 설정 기간 표시 */}
        {baseDate && autoEndDate && (
          <div className="bg-bg-light mt-3 flex items-center gap-2 rounded-xl px-4 py-3">
            <span className="text-prime-900 text-sm font-semibold">
              {format(baseDate, 'yyyy.MM.dd', { locale: ko })}
            </span>
            <ArrowRight className="text-prime-400 size-3.5 shrink-0" />
            <span className="text-prime-900 text-sm font-semibold">
              {format(autoEndDate, 'yyyy.MM.dd', { locale: ko })}
            </span>
            <span className="text-prime-400 ml-auto text-xs">
              {selectedType === 'weekly' ? '7일' : '31일'} 자동 설정
            </span>
          </div>
        )}

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
          !baseDate ? 'bg-bg-light' : hasEnough ? 'bg-bg-light' : 'bg-error-100/60'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2">
            <CalendarIcon
              className={cn(
                'size-4',
                !baseDate ? 'text-prime-300' : hasEnough ? 'text-main-blue' : 'text-error-500'
              )}
            />
          </div>
          <div>
            <p className="text-prime-900 text-sm font-semibold">
              {!baseDate
                ? '날짜를 선택하면 확인할 수 있어요'
                : hasEnough
                  ? `이 기간에 ${consultationCount}번의 대화가 있었네요 😊`
                  : `이 기간엔 대화 기록이 조금 더 필요해요`}
            </p>
            <p className="text-prime-500 mt-0.5 text-xs">
              {!baseDate
                ? '기간을 설정하면 대화 기록 수를 알려드릴게요.'
                : hasEnough
                  ? '분석하기 딱 좋은 데이터예요!'
                  : `${minRequired}번 이상 대화한 기간을 선택해 주세요.`}
            </p>
          </div>
        </div>
        {baseDate && (
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
        disabled={!baseDate || !hasEnough || !agreed}
        size="cta"
        className="h-12 text-base"
      >
        {buttonLabel()}
      </Button>

      {/* 안내 문구 */}
      <div className="text-prime-400 flex items-center gap-2">
        <Info className="size-3.5 shrink-0" />
        <p className="text-xs">
          소중한 대화 기록을 바탕으로 마음의 흐름을 정밀하게 분석하고 있습니다. 잠시만 기다려
          주세요.
        </p>
      </div>
    </div>
  );
}
