'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { CheckboxItem } from '@/shared/ui/checkbox-item';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

export interface ConditionsProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAgree?: () => void;
}

/**
 * Conditions 모달 컴포넌트
 * "만 14세 이상 이용 확인" 약관 동의 모달
 * Figma: 디자인 시스템 > Conditions
 */
export function Conditions({ isOpen = true, onClose, onAgree }: ConditionsProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    if (isChecked) {
      onAgree?.();
      onClose?.();
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent maxWidth="max-w-lg" showClose>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-semibold leading-tight">
            만 14세 이상 이용 확인
          </DialogTitle>
        </DialogHeader>

        {/* 본문: 스크롤 가능한 약관 내용 */}
        <div className="flex max-h-96 items-start gap-2.5 overflow-y-auto">
          <div className="flex-1">
            <p className="text-prime-700 text-sm leading-relaxed whitespace-pre-wrap">
              {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
            </p>
          </div>
          {/* 스크롤 바 (데코레이션) */}
          <div className="bg-cta-300/10 relative w-4 shrink-0 rounded-full">
            <div className="bg-cta-300/30 absolute top-0 right-0 h-20 w-4 rounded-full" />
          </div>
        </div>

        {/* 동의 체크박스 */}
        <div className="mt-6 border-t border-neutral-300 pt-4">
          <CheckboxItem
            label="동의하기"
            checked={isChecked}
            showTag={false}
            onChange={() => setIsChecked((v) => !v)}
          />
        </div>

        {/* CTA 버튼 */}
        <Button
          onClick={handleAgree}
          disabled={!isChecked}
          variant="primary"
          size="cta"
          className="mt-4"
        >
          동의하기
        </Button>
      </DialogContent>
    </DialogRoot>
  );
}

export default Conditions;
