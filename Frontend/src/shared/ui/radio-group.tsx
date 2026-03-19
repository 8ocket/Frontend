import React from 'react';

import { cn } from '@/shared/lib/utils';

// ── Figma 디자인 시스템: Radio (node 1306:3253) ─────────────────
// 20×20, rounded-full, border-1 neutral-300 (#e2e8f0)
// Inner circle: 10×10, rounded-full
// States:
//   Selected: border cta-300, inner cta-300, bg secondary-100
//   Default:  border neutral-300, bg secondary-100
//   Disabled: border neutral-300, inner neutral-400 (#cbd5e1)
//   Error:    border error-700 (#8e0c0c), inner neutral-400
// Label: Pretendard 16px Medium, lineHeight: 1
// ─────────────────────────────────────────────────────────────────

export interface RadioOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface RadioGroupProps<T = string> {
  legend: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name: string;
  orientation?: 'horizontal' | 'vertical';
  columns?: number;
  /** legend ↔ 옵션 사이 gap (Tailwind gap 클래스) */
  legendGap?: string;
  /** 옵션 컨테이너에 직접 적용할 className */
  contentClassName?: string;
  /** 개별 라디오 아이템에 적용할 className */
  itemClassName?: string;
  /** 전체 disabled */
  disabled?: boolean;
  /** 에러 상태 (border-error-700) */
  error?: boolean;
}

export function RadioGroup<T = string>({
  legend,
  options,
  value,
  onChange,
  name,
  orientation = 'horizontal',
  columns = 2,
  legendGap = 'gap-2',
  contentClassName,
  itemClassName,
  disabled = false,
  error = false,
}: RadioGroupProps<T>) {
  const defaultGridClass =
    orientation === 'vertical'
      ? 'flex flex-col gap-4'
      : `grid gap-4 ${columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3'}`;

  return (
    <fieldset className={cn('flex flex-col', legendGap)} disabled={disabled}>
      <legend
        className={cn(
          'text-xl leading-[1.3] font-semibold tracking-[-0.3px]',
          error ? 'text-error-700' : 'text-prime-800 dark:text-secondary-100'
        )}
      >
        {legend}
      </legend>
      <div className={cn(defaultGridClass, contentClassName)}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled === true;

          // Figma: outer circle border 색상
          const outerClass = cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
            error
              ? 'border-error-700'
              : isSelected && !isDisabled
                ? 'border-cta-300'
                : 'border-neutral-300',
            'bg-secondary-100 dark:bg-prime-800'
          );

          // Figma: inner circle 색상 (10×10)
          const innerClass = cn(
            'h-2.5 w-2.5 rounded-full',
            error || isDisabled ? 'bg-neutral-400' : 'bg-cta-300'
          );

          return (
            <label
              key={String(option.value)}
              className={cn(
                'flex items-center gap-2',
                isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                itemClassName
              )}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <div className={outerClass}>
                {isSelected && <div className={innerClass} />}
              </div>
              <span
                className={cn(
                  'text-base leading-none font-medium',
                  error
                    ? 'text-error-700'
                    : isDisabled
                      ? 'text-neutral-400'
                      : 'text-prime-600 dark:text-prime-300'
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
