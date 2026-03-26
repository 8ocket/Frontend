'use client';

// Figma MODAL 10 (node 2113:9240) — 크레딧 부족 알림
// 350×273, VERTICAL layout, padding 24px all, gap 24
// bg: secondary-100, border: 2px solid rgba(130,201,255,0.30), radius: 12

import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

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

const FONT_BASE = { fontFamily: 'var(--font-pretendard)' } as const;

// TODO: 타이포그래피 토큰으로 전환
// TITLE_STYLE → className="heading-02 text-error-600"
// BODY_STYLE  → className="body-1 text-prime-700"
// BTN_STYLE   → className="button-1"
const TITLE_STYLE = {
  ...FONT_BASE,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  color: 'var(--color-error-600)',
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

export function ChatCreditModal({
  isOpen,
  onClose,
  remainingCredits,
  onEnd,
  onPurchase,
}: ChatCreditModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">
        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* 제목 — Pretendard 24px/600, lh 31.2px, #BD1010, CENTER */}
            <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
              크레딧이 부족합니다
            </DialogTitle>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER */}
            <div className="flex w-full flex-col items-center gap-6">
              {/* 본문 — Pretendard 16px/400, lh 25.6px, #3F526F, CENTER */}
              <DialogDescription className="w-full text-center" style={BODY_STYLE}>
                크레딧 부족으로 추가 상담을 진행할 수 없습니다. 크레딧을 구매하시겠습니까?
              </DialogDescription>

              {/* Frame 1597882345 — HORIZONTAL, gap 8, primary CENTER, 124×26 */}
              <div className="flex flex-row items-center justify-center gap-2">
                {/* 잔여 크레딧 라벨 — Pretendard 16px/400, lh 25.6px, #8A9BA8 */}
                <span style={{ ...BODY_STYLE, color: 'var(--color-tertiary-400)' }}>잔여 크레딧 :</span>
                {/* 크레딧 값 — Pretendard 16px/400, lh 25.6px, #0B63F3 */}
                <span style={{ ...BODY_STYLE, color: 'var(--color-info-600)' }}>
                  {remainingCredits.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, gap 24, cross CENTER, 302×44 */}
          <div className="flex w-full flex-row items-center justify-between">
            {/* 종료하기 — 104×44, bg secondary-100, border #BD1010, text #BD1010, radius 8, padding H24/V14 */}
            <button
              type="button"
              onClick={onEnd}
              className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
              style={{ ...BTN_STYLE, borderColor: 'var(--color-error-600)', color: 'var(--color-error-600)' }}
            >
              종료하기
            </button>
            {/* 구매하기 — 104×44, bg cta-300 (#82C9FF), text prime-900, radius 8, padding H24/V14 */}
            <button
              type="button"
              onClick={onPurchase}
              className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors"
              style={BTN_STYLE}
            >
              구매하기
            </button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
