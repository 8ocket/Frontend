'use client';

// Figma MODAL 14 (node 2113:9375) — 미완결 상담 알림
// 350×279, bg secondary-100, border 2px glass-stroke/30, radius 12
// Semantic: Yellow (제목 warning-600)

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ChatUnfinishedSessionModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 미완결 상담 제목 */
  sessionTitle: string;
  /** 미완결 상담 일자 (포맷된 문자열) */
  sessionDate: string;
  /** 무시한다 버튼 클릭 */
  onIgnore: () => void;
  /** 진행한다 버튼 클릭 */
  onResume: () => void;
}

export function ChatUnfinishedSessionModal({
  isOpen,
  onClose,
  sessionTitle,
  sessionDate,
  onIgnore,
  onResume,
}: ChatUnfinishedSessionModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]">
        <div className="flex flex-col items-center gap-6">
          {/* ── 텍스트 영역 ── */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* 제목 — Heading 02, warning-600 */}
            <DialogTitle className="text-warning-600 w-full text-center text-2xl leading-[1.3] font-semibold tracking-[-0.36px]">
              마무리가 안 된 상담이 있습니다
            </DialogTitle>

            {/* 설명 — Body 01, prime-700 */}
            <DialogDescription className="text-prime-700 w-full text-center text-base leading-[1.6] font-normal">
              이전에 중단되어 마무리가 되지 않은
              <br />
              상담이 있습니다. 돌아가서 진행하시습니까?
            </DialogDescription>

            {/* 미완결 상담 정보 — Caption 01, warning-700 + prime-500 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-warning-700 text-center text-xs leading-[1.2] font-medium tracking-[-0.18px]">
                [{sessionTitle}]
              </span>
              <span className="text-prime-500 text-center text-xs leading-[1.2] font-medium tracking-[-0.18px]">
                {sessionDate}
              </span>
            </div>
          </div>

          {/* ── 버튼 영역 ── */}
          <div className="flex w-full items-center justify-between">
            <Button variant="secondary" semantic="yellow" onClick={onIgnore}>
              무시한다
            </Button>
            <Button variant="primary" onClick={onResume}>
              진행한다
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
