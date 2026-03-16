'use client';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function TermsCheckbox({ checked, onChange, className }: TermsCheckboxProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex size-5 shrink-0 items-center justify-center overflow-clip rounded-sm border border-solid ${
        checked ? 'border-[#82c9ff] bg-[#82c9ff]' : 'border-[#e2e8f0] bg-white'
      } ${className || ''}`}
      data-testid={`terms-checkbox-${checked ? 'checked' : 'unchecked'}`}
    >
      {checked && <span className="text-xs leading-none font-medium text-white">✓</span>}
    </button>
  );
}
