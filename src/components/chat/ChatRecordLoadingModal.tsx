'use client';

// Figma "마음기록 제작 대기 화면" (node 1962:11229)
// 350×247, bg secondary-100, border 2px glass-stroke/30, radius 12
// Semantic: Blue (제목 info-500), p-4 (16px)

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ChatRecordLoadingModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 대기한다 버튼 클릭 (현재 페이지에서 대기) */
  onWait: () => void;
  /** 종료하기 버튼 클릭 (페이지 이탈) */
  onExit: () => void;
}

export function ChatRecordLoadingModal({
  isOpen,
  onClose,
  onWait,
  onExit,
}: ChatRecordLoadingModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-4">
        <div className="flex flex-col items-center gap-6">
          {/* ── 텍스트 영역 (gap-4: Figma 스펙 16px) ── */}
          <div className="flex w-full flex-col items-center gap-4">
            {/* 제목 — Heading 02, info-500 */}
            <DialogTitle className="text-info-500 w-full text-center text-2xl leading-[1.3] font-semibold tracking-[-0.36px]">
              마음기록을 제작 중입니다
            </DialogTitle>

            {/* 설명 — Body 01, prime-700 */}
            <DialogDescription className="text-prime-700 w-full text-center text-base leading-[1.6] font-normal">
              현재 페이지에서 대기하지 않으시더라도 마음기록은 자동 생성됩니다. 여기서
              대기하시겠습니까?
            </DialogDescription>
          </div>

          {/* ── 로딩 스피너 ── */}
          <div className="flex items-center justify-center">
            <div className="border-info-500 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>

          {/* ── 버튼 영역 ── */}
          <div className="flex w-full items-center justify-between">
            <Button variant="secondary" onClick={onWait}>
              대기한다
            </Button>
            <Button variant="primary" onClick={onExit}>
              종료하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
