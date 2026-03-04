import React from 'react';

export interface RadioOption<T = string> {
  label: string;
  value: T;
}

interface RadioGroupProps<T = string> {
  legend: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name: string;
  orientation?: 'horizontal' | 'vertical';
  columns?: number;
}

export function RadioGroup<T = string>({
  legend,
  options,
  value,
  onChange,
  name,
  orientation = 'horizontal',
  columns = 2,
}: RadioGroupProps<T>) {
  const gridClass =
    orientation === 'vertical'
      ? 'flex flex-col gap-4'
      : `grid gap-4 ${columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3'}`;

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-prime-800 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
        {legend}
      </legend>
      <div className={gridClass}>
        {options.map((option) => (
          <label
            key={String(option.value)}
            className="flex flex-1 cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as T)}
              className="accent-cta-300 h-5 w-5 rounded"
            />
            <span className="text-prime-600 text-base font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
