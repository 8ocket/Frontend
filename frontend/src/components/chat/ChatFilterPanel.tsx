'use client';

// Figma 1512:3168 — Frame 1597881554
// 352×407, fill success-700 (#10b981), radius 8
// 루트 no layout mode → 절대좌표 → flex 구조로 변환

import { useState } from 'react';

import { ChevronDown, X } from 'lucide-react';

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

// 연도/월/일 선택 드롭다운 — Figma 1512:3274~3287
// 53×24 (연도), 41×24 (월/일), HORIZONTAL gap 4, text inverse fw:500 fs:14px + ChevronDown
function DateSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex flex-row items-center gap-1">
      <span
        className="text-inverse shrink-0"
        style={{
          fontFamily: 'var(--font-pretendard)',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '100%',
        }}
      >
        {label}
      </span>
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center"
        aria-label={label + ' 선택'}
      >
        <ChevronDown className="text-inverse" size={8} strokeWidth={2} />
      </button>
      {/* native select overlay for accessibility */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

const YEAR_OPTIONS = ['2024', '2025', '2026'];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

const PERSONAS: { id: PersonaFilter; avatarSrc?: string }[] = [
  { id: 'mental' },
  { id: 'career' },
  { id: 'coaching' },
];

export function ChatFilterPanel({
  onClose,
  onApply,
  startDate: initialStartDate = { year: '2026', month: '02', day: '01' },
  endDate: initialEndDate = { year: '2026', month: '02', day: '17' },
  persona: initialPersona = null,
  keyword: initialKeyword = '',
}: ChatFilterPanelProps) {
  const [startDate, setStartDate] = useState<DateSelector>(initialStartDate);
  const [endDate, setEndDate] = useState<DateSelector>(initialEndDate);
  const [persona, setPersona] = useState<PersonaFilter>(initialPersona);
  const [keyword, setKeyword] = useState(initialKeyword);

  return (
    <div
      className="bg-success-700 flex w-88 flex-col rounded-lg p-4"
      style={{ gap: '0px' }}
    >
      {/* Header — "필터 옵션" + X, y=16 */}
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
        {/* Close — Frame 24×24, Vector 9×9, fill inverse */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="필터 닫기"
        >
          <X className="text-inverse" size={9} strokeWidth={2} />
        </button>
      </div>

      {/* 일자 설정 — y=53, gap 16px from header bottom */}
      <div className="mt-4 flex flex-col gap-2">
        {/* Section label */}
        <span
          className="text-secondary-200"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '130%',
          }}
        >
          일자 설정
        </span>

        {/* 시작일 row — y=80 */}
        <div className="flex flex-row items-center gap-2">
          <span
            className="text-secondary-300 w-9 shrink-0"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '160%',
            }}
          >
            시작일
          </span>
          <DateSelect label="연도" value={startDate.year} options={YEAR_OPTIONS} onChange={(v) => setStartDate((p) => ({ ...p, year: v }))} />
          <DateSelect label="월" value={startDate.month} options={MONTH_OPTIONS} onChange={(v) => setStartDate((p) => ({ ...p, month: v }))} />
          <DateSelect label="일" value={startDate.day} options={DAY_OPTIONS} onChange={(v) => setStartDate((p) => ({ ...p, day: v }))} />
        </div>

        {/* 종료일 row — y=113 */}
        <div className="flex flex-row items-center gap-2">
          <span
            className="text-secondary-300 w-9 shrink-0"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '160%',
            }}
          >
            종료일
          </span>
          <DateSelect label="연도" value={endDate.year} options={YEAR_OPTIONS} onChange={(v) => setEndDate((p) => ({ ...p, year: v }))} />
          <DateSelect label="월" value={endDate.month} options={MONTH_OPTIONS} onChange={(v) => setEndDate((p) => ({ ...p, month: v }))} />
          <DateSelect label="일" value={endDate.day} options={DAY_OPTIONS} onChange={(v) => setEndDate((p) => ({ ...p, day: v }))} />
        </div>
      </div>

      {/* 상담사 종류 — y=159, gap ~22px from date section */}
      <div className="mt-5.5 flex flex-col gap-2">
        <span
          className="text-secondary-200"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '130%',
          }}
        >
          상담사 종류
        </span>

        {/* Avatar row — y=185, gap 13px between avatars */}
        <div className="flex flex-row gap-3.25">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPersona((prev) => (prev === p.id ? null : p.id))}
              className={[
                'flex h-11 w-11 items-center justify-center overflow-hidden rounded-full',
                persona === p.id ? 'ring-2 ring-white ring-offset-1' : '',
              ].join(' ')}
            >
              {p.avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatarSrc} alt={p.id ?? ''} className="h-full w-full object-cover" />
              ) : (
                <div className="bg-secondary-300 h-full w-full rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 키워드 — y=253, gap ~24px from persona section */}
      <div className="mt-6 flex flex-col gap-2">
        <span
          className="text-secondary-200"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '130%',
          }}
        >
          키워드
        </span>

        {/* Input — 320×44, fill secondary-100, stroke neutral-300, pad T12 R16 B12 L16, radius 8 */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Placeholder"
          className="border-neutral-300 bg-secondary-100 placeholder:text-neutral-400 h-11 w-full rounded-lg border px-4 py-3 outline-none"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '160%',
          }}
        />
      </div>

      {/* 필터 적용 버튼 — y=347, centered x=121, 108×44, fill cta-300, radius 8 */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => onApply({ startDate, endDate, persona, keyword: keyword })}
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
  );
}
