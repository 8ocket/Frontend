'use client';

// Figma MODAL 15 (node 2113:9421) — 마음기록 제작 대기
// 350×271, VERTICAL layout, padding 24px all, gap 24
// bg: secondary-100, border: 2px solid rgba(130,201,255,0.30), radius: 12

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

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

const FONT_BASE = { fontFamily: 'var(--font-pretendard)' } as const;

const TITLE_STYLE = {
  ...FONT_BASE,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  color: '#0B63F3',
} as const;

const BODY_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '25.6px',
  color: '#3F526F',
} as const;

const BTN_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '16px',
} as const;

export function ChatRecordLoadingModal({
  isOpen,
  onClose,
  onWait,
  onExit,
}: ChatRecordLoadingModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">
        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* 제목 — Pretendard 24px/600, lh 31.2px, #0B63F3, CENTER */}
            <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
              마음기록을 제작 중입니다
            </DialogTitle>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER */}
            <DialogDescription className="w-full text-center" style={BODY_STYLE}>
              현재 페이지에서 대기하지 않더라도 마음기록은 자동 생성됩니다. 여기서 대기하시겠습니까?
            </DialogDescription>
          </div>

          {/* Loader Animation — 24×24
              도넛 구조: 외곽 GRADIENT_ANGULAR, 내부(20×20) #C4C4C4
              액센트 stroke: #3B82F6, strokeW:2
              CSS 근사: border-[#C4C4C4] border-t-[#3B82F6] animate-spin */}
          <div
            className="h-6 w-6 animate-spin rounded-full border-2"
            style={{ borderColor: '#C4C4C4', borderTopColor: '#3B82F6' }}
          />

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, gap 24, cross CENTER, 302×44 */}
          <div className="flex w-full flex-row items-center justify-between">
            {/* 대기한다 — 104×44, bg secondary-100, border #82C9FF, text #516A90, padding H24/V14, radius 8 */}
            <button
              type="button"
              onClick={onWait}
              className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
              style={{ ...BTN_STYLE, borderColor: '#82C9FF', color: '#516A90' }}
            >
              대기한다
            </button>
            {/* 종료하기 — 104×44, bg cta-300 (#82C9FF), text prime-900, padding H24/V14, radius 8 */}
            <button
              type="button"
              onClick={onExit}
              className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors"
              style={BTN_STYLE}
            >
              종료하기
            </button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
