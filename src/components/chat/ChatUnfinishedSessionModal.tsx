'use client';

// Figma MODAL 14 (node 2113:9375) — 미완결 상담 알림
// 350×279, VERTICAL layout, padding 24px all, gap 24
// bg: secondary-100, border: 2px solid rgba(130,201,255,0.30), radius: 12

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

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
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">
        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* 제목 — Pretendard 24px/600, lh 31.2px, #C57F08, CENTER */}
            <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
              마무리가 안 된 상담이 있습니다
            </DialogTitle>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER */}
            <div className="flex w-full flex-col items-center gap-6">
              {/* 본문 — Pretendard 16px/400, lh 25.6px, #3F526F, CENTER */}
              <DialogDescription className="w-full text-center" style={BODY_STYLE}>
                이전에 중단되어 마무리가 되지 않은 상담이 있습니다. 돌아가서 진행하시습니까?
              </DialogDescription>

              {/* Frame 1597881573 — VERTICAL, gap 4, cross CENTER, 173×32 */}
              <div className="flex flex-col items-center gap-1">
                {/* 세션 제목 — Pretendard 12px/500, lh 14.4px, #945F06, CENTER */}
                <span
                  className="text-center"
                  style={{ ...FONT_BASE, fontSize: '12px', fontWeight: 500, lineHeight: '14.4px', color: 'var(--color-warning-700)' }}
                >
                  [{sessionTitle}]
                </span>
                {/* 날짜 — Pretendard 12px/500, lh 14.4px, #6983AA, CENTER */}
                <span
                  className="text-center"
                  style={{ ...FONT_BASE, fontSize: '12px', fontWeight: 500, lineHeight: '14.4px', color: 'var(--color-prime-500)' }}
                >
                  {sessionDate}
                </span>
              </div>
            </div>
          </div>

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, gap 24, cross CENTER, 302×44 */}
          <div className="flex w-full flex-row items-center justify-between">
            {/* 무시한다 — 104×44, bg secondary-100, border #945F06, text #945F06, padding H24/V14, radius 8 */}
            <button
              type="button"
              onClick={onIgnore}
              className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
              style={{ ...BTN_STYLE, borderColor: 'var(--color-warning-700)', color: 'var(--color-warning-700)' }}
            >
              무시한다
            </button>
            {/* 진행한다 — 104×44, bg cta-300 (#82C9FF), text prime-900, padding H24/V14, radius 8 */}
            <button
              type="button"
              onClick={onResume}
              className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors"
              style={BTN_STYLE}
            >
              진행한다
            </button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
