'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';

interface DeleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSessionModal({ isOpen, onClose, onConfirm }: DeleteSessionModalProps) {
  const [agreed, setAgreed] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAgreed(false);
      onClose();
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">
        <div className="flex flex-col items-center gap-6">

          {/* 아이콘 + 제목 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-12 w-12 shrink-0 bg-error-600"
              style={{
                maskImage: "url('/images/icons/trash.svg')",
                maskSize: '28px 28px',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: "url('/images/icons/trash.svg')",
                WebkitMaskSize: '28px 28px',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            />
            <DialogTitle
              className="w-full text-center text-2xl font-semibold leading-[1.3] tracking-[-0.36px] text-prime-900"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              대화를 삭제하시나요?
            </DialogTitle>
          </div>

          {/* 본문 */}
          <DialogDescription
            className="text-prime-700 w-full text-center text-base font-normal leading-[1.6]"
            style={{ wordBreak: 'keep-all', fontFamily: 'var(--font-pretendard)' }}
          >
            본 대화를 삭제할 경우 복구가 불가능하며 심화 리포트와 감정 카드도 함께 삭제됩니다.
            <br />그래도 삭제하시겠습니까?
          </DialogDescription>

          {/* 체크박스 */}
          <label className="flex cursor-pointer items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                agreed ? 'border-cta-300 bg-cta-300' : 'border-neutral-300 bg-secondary-100'
              )}
            >
              {agreed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span
              className="text-sm font-medium text-black"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              위 내용을 확인 했습니다.
            </span>
          </label>

          {/* 버튼 */}
          <div className="flex w-full items-center justify-between gap-6">
            <button
              type="button"
              onClick={() => { setAgreed(false); onClose(); }}
              className="h-11 flex-1 rounded-lg border border-cta-300 bg-secondary-100 text-base font-medium text-prime-700 transition-opacity hover:opacity-80"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              취소하기
            </button>
            <button
              type="button"
              onClick={() => { setAgreed(false); onConfirm(); }}
              disabled={!agreed}
              className="h-11 flex-1 rounded-lg bg-cta-300 text-base font-medium text-prime-900 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              삭제하기
            </button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
