'use client';

import { Button } from '@/shared/ui/button';
import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

export interface ChatSatisfactionModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** "네, 도움됐어요!" 버튼 클릭 */
  onYes: () => void;
  /** "아니오" 버튼 클릭 */
  onNo: () => void;
}

const FONT_BASE = { fontFamily: 'var(--font-pretendard)' } as const;

const TITLE_STYLE = {
  ...FONT_BASE,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  letterSpacing: '-0.36px',
  color: 'var(--color-prime-900)',
} as const;

const BODY_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '25.6px',
  color: 'var(--color-prime-700)',
} as const;

function SatisfactionIcon() {
  return (
    <div style={{ width: 48, height: 48 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4ZM17 19C17 17.895 17.895 17 19 17C20.105 17 21 17.895 21 19C21 20.105 20.105 21 19 21C17.895 21 17 20.105 17 19ZM29 21C27.895 21 27 20.105 27 19C27 17.895 27.895 17 29 17C30.105 17 31 17.895 31 19C31 20.105 30.105 21 29 21ZM33.5 29C31.8 32.2 28.1 34 24 34C19.9 34 16.2 32.2 14.5 29H33.5Z" fill="var(--color-cta-400)"/>
      </svg>
    </div>
  );
}

export function ChatSatisfactionModal({ isOpen, onClose, onYes, onNo }: ChatSatisfactionModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">

        <div className="flex w-full flex-col items-center gap-6">

          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-col items-center gap-2">
              <SatisfactionIcon />
              <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
                상담이 도움이 되셨나요?
              </DialogTitle>
            </div>

            <DialogDescription className="w-full text-center" style={BODY_STYLE}>
              소중한 의견을 들려주세요.
            </DialogDescription>
          </div>

          <div className="flex w-full flex-row items-center justify-between gap-6">
            <Button
              variant="secondary"
              onClick={onNo}
              className="w-35 shrink-0 px-6"
            >
              아니오
            </Button>
            <Button
              variant="primary"
              onClick={onYes}
              className="w-35 shrink-0 px-6"
            >
              네, 도움됐어요!
            </Button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
