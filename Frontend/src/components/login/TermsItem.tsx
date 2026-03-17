'use client';

import { TermsCheckbox } from './TermsCheckbox';

interface TermsItemProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  required?: boolean;
  type?: 'required' | 'optional';
}

export function TermsItem({
  checked,
  onChange,
  label,
  required = true,
  type = 'required',
}: TermsItemProps) {
  const tagColor = type === 'optional' ? 'text-[#f59e0b]' : 'text-[rgba(130,201,255,0.8)]';

  return (
    <div className="flex items-center gap-2">
      <TermsCheckbox checked={checked} onChange={onChange} />
      <div className="flex items-center gap-1">
        <span className="text-base leading-none font-medium text-[#2c3a4f]">{label}</span>
        <span className={`text-base leading-none font-medium ${tagColor}`}>
          ({type === 'optional' ? '선택' : '필수'})
        </span>
      </div>
    </div>
  );
}
