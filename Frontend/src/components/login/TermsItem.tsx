'use client';

import { CheckboxItem } from '@/shared/ui/checkbox-item';

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
  return (
    <CheckboxItem
      label={label}
      checked={checked}
      required={required ?? type === 'required'}
      showTag
      onChange={() => onChange(!checked)}
    />
  );
}
