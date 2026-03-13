'use client';

// Figma MODAL 10 (node 2113:9240) — 크레딧 부족 알림
// 350×273, bg secondary-100, border 2px glass-stroke/30, radius 12
// Semantic: Red (제목 error-600)

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ChatCreditModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 현재 잔여 크레딧 */
  remainingCredits: number;
  /** 종료하기 버튼 클릭 */
  onEnd: () => void;
  /** 구매하기 버튼 클릭 */
  onPurchase: () => void;
}

export function ChatCreditModal({
  isOpen,
  onClose,
  remainingCredits,
  onEnd,
  onPurchase,
}: ChatCreditModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]">
        <div className="flex flex-col items-center gap-6">
          {/* ── 텍스트 영역 ── */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* 제목 — Heading 02, error-600 */}
            <DialogTitle className="text-error-600 w-full text-center text-2xl leading-[1.3] font-semibold tracking-[-0.36px]">
              크레딧이 부족합니다
            </DialogTitle>

            {/* 설명 — Body 01, prime-700 */}
            <DialogDescription className="text-prime-700 w-full text-center text-base leading-[1.6] font-normal">
              크레딧 부족으로 추가 상담을 진행할 수 없습니다. 크레딧을 구매하시겠습니까?
            </DialogDescription>

            {/* 잔여 크레딧 정보 */}
            <div className="flex items-center gap-2 text-base leading-[1.6]">
              <span className="text-tertiary-400">잔여 크레딧 :</span>
              <span className="text-info-600">{remainingCredits.toLocaleString()}</span>
            </div>
          </div>

          {/* ── 버튼 영역 ── */}
          <div className="flex w-full items-center justify-between">
            <Button variant="secondary" semantic="red" onClick={onEnd}>
              종료하기
            </Button>
            <Button variant="primary" onClick={onPurchase}>
              구매하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
