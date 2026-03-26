'use client';

// Figma MODAL 12 (node 2113:9318) — 페르소나 선택 확인
// 350×223, VERTICAL layout, padding 24px all, gap 24
// bg: secondary-100, border: 2px solid rgba(130,201,255,0.30), radius: 12

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

export interface ChatPersonaConfirmModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 다시 선택 버튼 클릭 */
  onReselect: () => void;
  /** 진행하기 버튼 클릭 */
  onConfirm: () => void;
}

const FONT_BASE = { fontFamily: 'var(--font-pretendard)' } as const;

// Figma: Pretendard SemiBold 24px, lh 31.2px, letter-spacing -0.36px, #C57F08
const TITLE_STYLE = {
  ...FONT_BASE,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  letterSpacing: '-0.36px',
  color: 'var(--color-warning-600)',
} as const;

// Figma: Pretendard Regular 16px, lh 25.6px, #3F526F
const BODY_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '25.6px',
  color: 'var(--color-prime-700)',
} as const;

// Figma: Pretendard Medium 16px, lh 16px
const BTN_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '16px',
} as const;

export function ChatPersonaConfirmModal({
  isOpen,
  onClose,
  onReselect,
  onConfirm,
}: ChatPersonaConfirmModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">

        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER, 302×175 */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER, 302×107 */}
          <div className="flex w-full flex-col items-center gap-6">

            {/* 제목 — Pretendard 24px/600, lh 31.2px, letter-spacing -0.36px, #C57F08, CENTER */}
            <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
              선택하신 페르소나가 맞나요?
            </DialogTitle>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER, 302×52 */}
            <div className="flex w-full flex-col items-center gap-6">

              {/* 본문 — Pretendard 16px/400, lh 25.6px, #3F526F, CENTER */}
              <DialogDescription className="w-full text-center" style={BODY_STYLE}>
                {'선택하신 페르소나가 맞는지 확인해 주십시오. \n내용이 정확하다면 [진행하기]를 눌러주십시오.'}
              </DialogDescription>

            </div>
          </div>

          {/* Frame 1597882320 (buttons) — HORIZONTAL, SPACE_BETWEEN, cross CENTER, 302×44 */}
          <div className="flex w-full flex-row items-center justify-between">

            {/* 다시 선택 — Secondary/Yellow, 108×44, bg secondary-100, border 1px #945F06, text #945F06, radius 8, padding H24/V14 */}
            <button
              type="button"
              onClick={onReselect}
              className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
              style={{ ...BTN_STYLE, borderColor: 'var(--color-warning-700)', color: 'var(--color-warning-700)' }}
            >
              다시 선택
            </button>

            {/* 진행하기 — Primary/Blue, 104×44, bg cta-300 (#82C9FF), text prime-900, radius 8, padding H24/V14 */}
            <button
              type="button"
              onClick={onConfirm}
              className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors"
              style={BTN_STYLE}
            >
              진행하기
            </button>

          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
