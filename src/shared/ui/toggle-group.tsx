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
  return (
    <div className="flex flex-col gap-1.5">
      {legend && <p className="text-sm font-medium text-slate-700">{legend}</p>}
      <div className={cn('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'h-11 rounded-lg border text-sm font-medium transition-all',
              value === option
                ? 'border-blue-400 bg-blue-50 text-blue-600'
                : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50/30'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
