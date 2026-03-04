import React from 'react';
import { Button } from './button';

export interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  subtitle?: string;
}

export function SuccessModal({
  isOpen,
  title,
  description,
  buttonLabel = '확인',
  onButtonClick,
  subtitle,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative flex w-full max-w-[360px] flex-col gap-8 rounded-2xl bg-white px-8 py-8 shadow-xl">
        {/* 텍스트 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-prime-600 text-base leading-[1.4] font-medium">{subtitle}</p>
          )}
          {description && (
            <p className="text-prime-500 text-sm leading-[1.4] font-normal">{description}</p>
          )}
        </div>

        {/* 버튼 */}
        <Button onClick={onButtonClick} variant="primary" size="default" className="w-full">
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
