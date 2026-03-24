import { cn } from '@/shared/lib/utils';

interface ToggleGroupProps<T extends string> {
  legend: string;
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
    <div className="flex flex-col gap-3">
      <p className="text-prime-900 text-base font-medium leading-6 tracking-[-0.24px]">
        {legend}
      </p>
      <div className={cn('grid gap-4', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'h-14 rounded-xl text-base font-medium transition-all',
              value === option
                ? 'bg-cta-300 text-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]'
                : 'bg-prime-100 text-prime-600 hover:bg-prime-200'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
