import React from 'react';
import { Dialog } from './dialog';
import { Button } from './button';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  buttonLabel = '확인',
  onButtonClick,
}: SuccessModalProps) {
  const handleButtonClick = () => {
    onButtonClick?.();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-[400px]" closeButton={false}>
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
      <div className="mt-8 flex flex-col gap-3">
        <Button onClick={handleButtonClick} variant="primary" size="default" className="w-full">
          {buttonLabel}
        </Button>
      </div>
    </Dialog>
  );
}
