'use client';

// Figma MODAL 10 (node 2113:9240) — 크레딧 부족 알림
// Root: 350×329(HUG), VERTICAL, padding 24px all
// bg: VariableID:575:5007 = #F8FAFC (secondary-100)
// border: 2px INSIDE, VariableID:1243:2688 = rgba(130,201,255,0.30)
// radius: 12px

import { Button } from '@/shared/ui/button';
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

// Pretendard SemiBold 24px, lh 31.2px, ls -0.36px, #1A222E (VariableID:575:5006 = prime-900)
const TITLE_STYLE = {
  ...FONT_BASE,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  letterSpacing: '-0.36px',
  color: 'var(--color-prime-900)',
} as const;

// Pretendard Regular 16px, lh 25.6px, #3F526F (VariableID:575:5015 = prime-700)
const BODY_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '25.6px',
  color: 'var(--color-prime-700)',
} as const;

// Vector (icon): 28×36 inside 48×48 Frame, fill VariableID:576:5128 = #BD1010 (error-500)
function CreditIcon() {
  return (
    <div style={{ width: 48, height: 48 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 35H25V33H28C28.2833 33 28.5208 32.9042 28.7125 32.7125C28.9042 32.5208 29 32.2833 29 32V26C29 25.7167 28.9042 25.4792 28.7125 25.2875C28.5208 25.0958 28.2833 25 28 25H21V21H29V19H25V17H23V19H20C19.7167 19 19.4792 19.0958 19.2875 19.2875C19.0958 19.4792 19 19.7167 19 20V26C19 26.2833 19.0958 26.5208 19.2875 26.7125C19.4792 26.9042 19.7167 27 20 27H27V31H19V33H23V35ZM13.231 42C12.3103 42 11.5417 41.6917 10.925 41.075C10.3083 40.4583 10 39.6897 10 38.769V9.231C10 8.31033 10.3083 7.54167 10.925 6.925C11.5417 6.30833 12.3103 6 13.231 6H27.154L38 16.846V38.769C38 39.6897 37.6917 40.4583 37.075 41.075C36.4583 41.6917 35.6897 42 34.769 42H13.231Z" fill="#BD1010"/>
      </svg>
    </div>
  );
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
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">

        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER, 302×281(HUG) */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER, 302×213(HUG) */}
          <div className="flex w-full flex-col items-center gap-6">

            {/* Frame 1597882682 — VERTICAL, gap 8, cross CENTER, 302×87(HUG) */}
            <div className="flex w-full flex-col items-center gap-2">
              {/* Frame (icon container) — 48×48, contains Vector 28×36, fill #BD1010 */}
              <CreditIcon />

              {/* 제목 — Pretendard SemiBold 24px, lh 31.2px, ls -0.36px, #1A222E, CENTER */}
              {/* VariableID:575:5006 = prime-900, style: Heading 02 */}
              <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
                크레딧이 부족합니다
              </DialogTitle>
            </div>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER, 302×52(HUG) */}
            <div className="flex w-full flex-col items-center gap-6">
              {/* 본문 — Pretendard Regular 16px, lh 25.6px, #3F526F, CENTER */}
              {/* VariableID:575:5015 = prime-700, style: Body 01 */}
              <DialogDescription className="w-full text-center" style={BODY_STYLE}>
                크레딧 부족으로 추가 상담을 진행할 수 없습니다. 크레딧을 구매하시겠습니까?
              </DialogDescription>

              {/* Frame 1597882345 — HORIZONTAL, gap 8, align CENTER, 124×26(HUG) */}
              <div className="flex flex-row items-center justify-center gap-2">
                {/* 잔여 크레딧 라벨 — Pretendard Regular 16px, lh 25.6px, #8A9BA8 */}
                {/* VariableID:575:5008 = tertiary-400 */}
                <span style={{ ...BODY_STYLE, color: 'var(--color-tertiary-400)' }}>
                  잔여 크레딧 :
                </span>
                {/* 크레딧 값 — Pretendard Regular 16px, lh 25.6px, #0B63F3 */}
                {/* VariableID:576:5138 = info-600 */}
                <span style={{ ...BODY_STYLE, color: 'var(--color-info-600)' }}>
                  {remainingCredits.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, gap 24, cross CENTER, 302×44(HUG) */}
          <div className="flex w-full flex-row items-center justify-between gap-6">
            {/* 종료하기 — Type=Secondary, Symentic=Blue, 140×44, padding H24/V14 */}
            {/* VariableID:1168:2204 = secondary-100 fill, VariableID:1168:2213 = cta-300 stroke */}
            <Button
              variant="secondary"
              onClick={onEnd}
              className="w-35 shrink-0 px-6"
            >
              종료하기
            </Button>
            {/* 구매하기 — Type=Primary, Symentic=Blue, 140×44, padding H24/V14 */}
            {/* VariableID:1168:2213 = cta-300 fill, VariableID:1168:2198 = prime-900 text */}
            <Button
              variant="primary"
              onClick={onPurchase}
              className="w-35 shrink-0 px-6"
            >
              구매하기
            </Button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
