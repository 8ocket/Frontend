'use client';

// Figma 1962:10353 — 필터 상세
// 556×384, fill success-700 (#10B981), radius 8, pad 16, gap 10

import { useEffect, useRef, useState } from 'react';

import { X } from 'lucide-react';

export type PersonaFilter = 'mental' | 'career' | 'coaching' | null;

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
    persona: PersonaFilter;
    keyword: string;
  }) => void;
  startDate?: DateSelector;
  endDate?: DateSelector;
  persona?: PersonaFilter;
  keyword?: string;
};

// 커스텀 드롭다운 (연도/월/일 공통)
// Figma 1958:7205(연도) hoverBg=#4ba1f0 / 1958:7053(월) 1958:7054(일) hoverBg=#82c9ff
// 연도 open state (1962:7930): dropdownBg=#10b981 (success-700)
// Default: white bg, #1A222E text / Hover: hoverBg, white text / Selected: #257cc0, white text
function CustomSelect({
  value,
  placeholder,
  options,
  onChange,
  hoverBg = '#4ba1f0',
  dropdownWidth = '60px',
  dropdownBg = '#ffffff',
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
  hoverBg?: string;
  dropdownWidth?: string;
  dropdownBg?: string;
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
        className="flex h-6 items-center gap-1 rounded bg-white px-1.5"
        aria-label={placeholder + ' 선택'}
      >
        {/* TODO: 타이포그래피 토큰으로 전환 → 13px는 토큰 미정의, 신규 토큰 추가 필요 */}
        <span
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '13px',
            fontWeight: 500,
            color: value ? '#1A222E' : '#E2E8F0',
            lineHeight: '100%',
          }}
        >
          {value || placeholder}
        </span>
        {/* TODO: 8px는 토큰 미정의, 아이콘으로 교체 검토 필요 */}
        <span style={{ fontSize: '8px', color: value ? '#1A222E' : '#E2E8F0', lineHeight: 1 }}>▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-7 left-0 z-50 overflow-y-auto rounded shadow-lg"
          style={{ width: dropdownWidth, maxHeight: '160px', backgroundColor: dropdownBg }}
        >
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className="w-full px-2 py-1 text-left"
                style={{
                  fontFamily: 'var(--font-pretendard)',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#ffffff' : '#1A222E',
                  backgroundColor: isSelected ? '#257cc0' : '#ffffff',
                  lineHeight: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = hoverBg;
                    el.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = '#ffffff';
                    el.style.color = '#1A222E';
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

// 시작일/종료일 블록 — 239x46, label 위 + selectors 아래
// Figma: TEXT "시작일/종료일" 14px w400 #B1C7DD + FRAME selectors gap:16
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
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          fontFamily: 'var(--font-pretendard)',
          fontSize: '14px',
          fontWeight: 400,
          color: 'var(--color-secondary-300)',
          lineHeight: '160%',
        }}
      >
        {label}
      </span>
      {/* selectors row — gap 16px */}
      <div className="flex flex-row items-center gap-4">
        {/* 연도 — Figma 1958:7205: hover #4ba1f0 / open bg #10b981 (1962:7930) */}
        <CustomSelect
          value={date.year}
          placeholder="연도"
          options={YEAR_OPTIONS}
          onChange={onYearChange}
          hoverBg="#4ba1f0"
          dropdownWidth="60px"
          dropdownBg="#10b981"
        />
        {/* 월 — Figma 1958:7053: hover #82c9ff / open bg #10b981 (1962:8270) */}
        <CustomSelect
          value={date.month}
          placeholder="월"
          options={MONTH_OPTIONS}
          onChange={onMonthChange}
          hoverBg="#82c9ff"
          dropdownWidth="36px"
          dropdownBg="#10b981"
        />
        {/* 일 — Figma 1958:7054: hover #82c9ff / open bg #10b981 (1962:8989) */}
        <CustomSelect
          value={date.day}
          placeholder="일"
          options={DAY_OPTIONS}
          onChange={onDayChange}
          hoverBg="#82c9ff"
          dropdownWidth="36px"
          dropdownBg="#10b981"
        />
      </div>
    </div>
  );
}

// Figma 1958:7205 — Years: 2035 → 2020 (최신순)
const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => String(2035 - i));
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

const PERSONAS: { id: PersonaFilter; avatarSrc?: string }[] = [
  { id: 'mental' },
  { id: 'career' },
  { id: 'coaching' },
];

const LABEL_STYLE = {
  fontFamily: 'var(--font-pretendard)',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--color-secondary-200)',
  lineHeight: '130%',
} as const;

export function ChatFilterPanel({
  onClose,
  onApply,
  startDate: initialStartDate = { year: '', month: '', day: '' },
  endDate: initialEndDate = { year: '', month: '', day: '' },
  persona: initialPersona = null,
  keyword: initialKeyword = '',
}: ChatFilterPanelProps) {
  const [startDate, setStartDate] = useState<DateSelector>(initialStartDate);
  const [endDate, setEndDate] = useState<DateSelector>(initialEndDate);
  const [persona, setPersona] = useState<PersonaFilter>(initialPersona);
  const [keyword, setKeyword] = useState(initialKeyword);

  return (
    <div
      className="bg-success-700 flex w-full flex-col rounded-lg p-4"
      style={{ gap: '10px' }}
    >
      {/* Inner: content + button — gap 24px */}
      <div className="flex flex-col gap-6">
        {/* Content: header + sections — gap 16px */}
        <div className="flex flex-col gap-4">

          {/* Header — "필터 옵션" SemiBold 16px white + X */}
          <div className="flex flex-row items-center justify-between">
            <span
              className="text-inverse"
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '130%',
              }}
            >
              필터 옵션
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center"
              aria-label="필터 닫기"
            >
              <X className="text-inverse" size={9} strokeWidth={2} />
            </button>
          </div>

          {/* Sections — gap 16px */}
          <div className="flex flex-col gap-4">

            {/* 일자 설정 + 상담사 종류 — gap 16px */}
            <div className="flex flex-col gap-4">

              {/* 일자 설정 — label + date rows */}
              <div className="flex flex-col gap-1.5">
                <span style={LABEL_STYLE}>일자 설정</span>

                {/* 시작일 row */}
                <DateBlock
                  label="시작일"
                  date={startDate}
                  onYearChange={(v) => setStartDate((p) => ({ ...p, year: v }))}
                  onMonthChange={(v) => setStartDate((p) => ({ ...p, month: v }))}
                  onDayChange={(v) => setStartDate((p) => ({ ...p, day: v }))}
                />
                {/* 종료일 row */}
                <DateBlock
                  label="종료일"
                  date={endDate}
                  onYearChange={(v) => setEndDate((p) => ({ ...p, year: v }))}
                  onMonthChange={(v) => setEndDate((p) => ({ ...p, month: v }))}
                  onDayChange={(v) => setEndDate((p) => ({ ...p, day: v }))}
                />
              </div>

              {/* 상담사 종류 — label + avatar row gap 16px */}
              <div className="flex flex-col gap-2">
                <span style={LABEL_STYLE}>상담사 종류</span>
                {/* Avatars — Figma 524x44, gap 16 */}
                <div className="flex flex-row gap-4">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPersona((prev) => (prev === p.id ? null : p.id))}
                      className={[
                        'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full transition-all',
                        persona === p.id
                          ? 'ring-2 ring-white ring-offset-1 ring-offset-[#10B981]'
                          : '',
                      ].join(' ')}
                    >
                      {p.avatarSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.avatarSrc} alt={p.id ?? ''} className="h-full w-full object-cover" />
                      ) : (
                        /* Figma placeholder: white bg + white border circle */
                        <div className="border-secondary-100 bg-white h-full w-full rounded-full border" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 키워드 — label + input */}
            <div className="flex flex-col gap-2">
              <span style={LABEL_STYLE}>키워드</span>
              {/* Input — 524x44, fill #F8FAFC, stroke #E2E8F0, r8, pad 12/16 */}
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Placeholder"
                className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 outline-none placeholder:text-[#CBD5E1]"
                style={{
                  fontFamily: 'var(--font-pretendard)',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '160%',
                }}
              />
            </div>
          </div>
        </div>

        {/* 필터 적용 버튼 — 108x44, fill cta-300, r8, centered */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onApply({ startDate, endDate, persona, keyword })}
            className="bg-cta-300 text-prime-900 flex h-11 items-center justify-center rounded-lg px-6 py-3.5"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '100%',
            }}
          >
            필터 적용
          </button>
        </div>
      </div>
    </div>
  );
}
