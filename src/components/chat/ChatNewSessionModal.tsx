'use client';

// Figma MODAL 11 (node 2113:9317) — 새로운 상담 안내
// 350×273, VERTICAL layout, padding 24px all, gap 24
// bg: secondary-100, border: 2px solid rgba(130,201,255,0.30), radius: 12

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

export interface ChatNewSessionModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 확인 버튼 클릭 */
  onConfirm: () => void;
}

const FONT_BASE = { fontFamily: 'var(--font-pretendard)' } as const;

const TITLE_STYLE = {
  ...FONT_BASE,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  color: 'var(--color-warning-600)',
} as const;

const BODY_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '25.6px',
  color: 'var(--color-prime-700)',
} as const;

const BTN_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '16px',
} as const;

export function ChatNewSessionModal({ isOpen, onClose, onConfirm }: ChatNewSessionModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">
        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* 제목 — Pretendard 24px/600, lh 31.2px, #C57F08, CENTER */}
            <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
              [새로운 상담] 버튼을 누르세요
            </DialogTitle>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER */}
            <div className="flex w-full flex-col items-center gap-6">
              {/* 본문 — Pretendard 16px/400, lh 25.6px, #3F526F, CENTER */}
              <DialogDescription className="w-full text-center" style={BODY_STYLE}>
                왼쪽 사이드바의 [상담] 버튼을 누르시면 새로운 상담을 진행하실 수 있습니다.
              </DialogDescription>

              {/* 부가안내 — Pretendard 16px/400, lh 25.6px, #8A9BA8, CENTER */}
              <p className="w-full text-center" style={{ ...BODY_STYLE, color: 'var(--color-tertiary-400)' }}>
                (하루 1회씩 무료로 상담 가능합니다.)
              </p>
            </div>
          </div>

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, cross CENTER, 302×44 */}
          <div className="flex w-full flex-row items-center justify-between">
            {/* 확인 버튼 — 76×44, bg cta-300 (#82C9FF), text prime-900, padding H24/V14, radius 8 */}
            <button
              type="button"
              onClick={onConfirm}
              className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors"
              style={BTN_STYLE}
            >
              확인
            </button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
