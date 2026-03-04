import React, { InputHTMLAttributes } from 'react';

interface CheckboxItemProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  onViewClick?: () => void;
  viewButtonLabel?: string;
}

export function CheckboxItem({
  label,
  required = false,
  onViewClick,
  viewButtonLabel = '약관보기',
  checked,
  onChange,
  ...props
}: CheckboxItemProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="flex flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-cta-300 h-5 w-5 rounded"
          {...props}
        />
        <span className="text-prime-800 text-base leading-[1.4] font-medium">
          {label}
          {required && <span className="text-cta-300"> (필수)</span>}
        </span>
      </label>
      {onViewClick && (
        <button
          onClick={onViewClick}
          className="text-cta-300 hover:text-cta-500 text-xs font-medium whitespace-nowrap"
        >
          {viewButtonLabel}
        </button>
      )}
    </div>
  );
}
