'use client';

// Figma MODAL 11 (node 2113:9317) — 새로운 상담 안내
// 350×273, bg secondary-100, border 2px glass-stroke/30, radius 12
// Semantic: Yellow (제목 warning-600)

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ChatNewSessionModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 확인 버튼 클릭 */
  onConfirm: () => void;
}

export function ChatNewSessionModal({ isOpen, onClose, onConfirm }: ChatNewSessionModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]">
        <div className="flex flex-col items-center gap-6">
          {/* ── 텍스트 영역 ── */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* 제목 — Heading 02, warning-600 */}
            <DialogTitle className="text-warning-600 w-full text-center text-2xl leading-[1.3] font-semibold tracking-[-0.36px]">
              [새로운 상담] 버튼을 누르세요
            </DialogTitle>

            {/* 설명 — Body 01, prime-700 */}
            <DialogDescription className="text-prime-700 w-full text-center text-base leading-[1.6] font-normal">
              왼쪽 사이드바의 [상담] 버튼을 누르시면
              <br />
              새로운 상담을 진행하실 수 있습니다.
            </DialogDescription>

            {/* 부가 안내 — Body 01, tertiary-400 */}
            <p className="text-tertiary-400 w-full text-center text-base leading-[1.6]">
              (하루 1회씩 무료로 상담 가능합니다.)
            </p>
          </div>

          {/* ── 버튼 영역 (단일 버튼 중앙 정렬) ── */}
          <div className="flex w-full items-center justify-center">
            <Button variant="primary" onClick={onConfirm}>
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
