'use client';

import { useEffect, useRef, useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';

type DateSelector = {
  year: string;
  month: string;
  day: string;
};

type ChatFilterPanelProps = {
  onClose: () => void;
  onApply: (filters: {
    startDate: DateSelector;
    endDate: DateSelector;
    keyword: string;
  }) => void;
  startDate?: DateSelector;
  endDate?: DateSelector;
  keyword?: string;
};

const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => String(2035 - i));
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

function CustomSelect({
  value,
  placeholder,
  options,
  onChange,
  dropdownWidth = '64px',
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
  dropdownWidth?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex shrink-0 items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="border-neutral-300 hover:border-cta-300 flex h-7 items-center gap-1 rounded-md border bg-white px-2 transition-colors"
        aria-label={placeholder + ' 선택'}
      >
        <span
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '13px',
            fontWeight: 500,
            color: value ? 'var(--color-prime-900)' : 'var(--color-neutral-500)',
            lineHeight: '100%',
          }}
        >
          {value || placeholder}
        </span>
        <span style={{ fontSize: '8px', color: 'var(--color-prime-700)', lineHeight: 1 }}>▼</span>
      </button>

      {isOpen && (
        <div
          className="border-neutral-300 absolute top-8 left-0 z-50 overflow-y-auto rounded-md border bg-white shadow-md"
          style={{ width: dropdownWidth, maxHeight: '160px' }}
        >
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className="w-full px-2 py-1.5 text-left transition-colors"
                style={{
                  fontFamily: 'var(--font-pretendard)',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'var(--white)' : 'var(--color-prime-900)',
                  backgroundColor: isSelected ? 'var(--main-blue)' : 'var(--white)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      'var(--color-bg-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--white)';
                  }
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DateBlock({
  label,
  date,
  onYearChange,
  onMonthChange,
  onDayChange,
}: {
  label: string;
  date: DateSelector;
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        style={{
          fontFamily: 'var(--font-pretendard)',
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--color-prime-700)',
          lineHeight: '160%',
        }}
      >
        {label}
      </span>
      <div className="flex flex-row items-center gap-2">
        <CustomSelect value={date.year} placeholder="연도" options={YEAR_OPTIONS} onChange={onYearChange} dropdownWidth="72px" />
        <CustomSelect value={date.month} placeholder="월" options={MONTH_OPTIONS} onChange={onMonthChange} dropdownWidth="52px" />
        <CustomSelect value={date.day} placeholder="일" options={DAY_OPTIONS} onChange={onDayChange} dropdownWidth="52px" />
      </div>
    </div>
  );
}

export function ChatFilterPanel({
  onClose,
  onApply,
  startDate: initialStartDate = { year: '', month: '', day: '' },
  endDate: initialEndDate = { year: '', month: '', day: '' },
  keyword: initialKeyword = '',
}: ChatFilterPanelProps) {
  const [startDate, setStartDate] = useState<DateSelector>(initialStartDate);
  const [endDate, setEndDate] = useState<DateSelector>(initialEndDate);
  const [keyword, setKeyword] = useState(initialKeyword);

  return (
    <div className="w-full border-b border-prime-100 bg-[#F4F8FF] px-5 py-4">
      <div className="flex flex-col gap-4">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-prime-900)',
              lineHeight: '130%',
              letterSpacing: '-0.01em',
            }}
          >
            필터 옵션
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center rounded text-prime-400 transition-colors hover:text-prime-700"
            aria-label="필터 닫기"
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        {/* 일자 설정 */}
        <div className="flex flex-col gap-2">
          <span
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-prime-700)',
              lineHeight: '130%',
            }}
          >
            일자 설정
          </span>
          <div className="flex flex-col gap-2">
            <DateBlock
              label="시작일"
              date={startDate}
              onYearChange={(v) => setStartDate((p) => ({ ...p, year: v }))}
              onMonthChange={(v) => setStartDate((p) => ({ ...p, month: v }))}
              onDayChange={(v) => setStartDate((p) => ({ ...p, day: v }))}
            />
            <DateBlock
              label="종료일"
              date={endDate}
              onYearChange={(v) => setEndDate((p) => ({ ...p, year: v }))}
              onMonthChange={(v) => setEndDate((p) => ({ ...p, month: v }))}
              onDayChange={(v) => setEndDate((p) => ({ ...p, day: v }))}
            />
          </div>
        </div>

        {/* 키워드 */}
        <div className="flex flex-col gap-1.5">
          <span
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-prime-700)',
              lineHeight: '130%',
            }}
          >
            키워드
          </span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="border-neutral-300 focus:border-cta-300 h-9 w-full rounded-lg border bg-white px-3 outline-none transition-colors placeholder:text-slate-300"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '13px',
              fontWeight: 400,
              color: 'var(--color-prime-900)',
            }}
          />
        </div>

        {/* 적용 버튼 */}
        <Button
          variant="primary"
          onClick={() => onApply({ startDate, endDate, keyword })}
          className="w-full"
        >
          필터 적용
        </Button>
      </div>
    </div>
  );
}
