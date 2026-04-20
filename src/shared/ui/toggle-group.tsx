import { useId } from 'react';
import { cn } from '@/shared/lib/utils';

interface ToggleGroupProps<T extends string> {
  legend?: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3;
}

export function ToggleGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 2,
}: ToggleGroupProps<T>) {
  const groupId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      {legend && <p className="text-sm font-medium text-slate-700">{legend}</p>}
      <div className={cn('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {options.map((option) => {
          const id = `${groupId}-${option}`;
          const checked = value === option;
          return (
            <label
              key={option}
              htmlFor={id}
              className={cn(
                'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                checked
                  ? 'border-cta-300 bg-cta-50 text-cta-400'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-cta-200 hover:bg-cta-50/30'
              )}
            >
              <input
                type="radio"
                id={id}
                name={groupId}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {/* 라디오 인디케이터 */}
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  checked ? 'border-cta-300 bg-cta-300' : 'border-slate-300 bg-white'
                )}
              >
                {checked && <span className="size-1.5 rounded-full bg-white" />}
              </span>
              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
}
