'use client';

// Figma MODAL 11 (node 2113:9317) — 새로운 상담 안내
// Root: 350×329(HUG), VERTICAL, padding 24px all
// bg: VariableID:575:5007 = #F8FAFC (secondary-100)
// border: 2px INSIDE, VariableID:1243:2688 = rgba(130,201,255,0.30)
// radius: VariableID:1180:2200 = 12px

import { Button } from '@/shared/ui/button';
import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

export interface ChatNewSessionModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 확인 버튼 클릭 */
  onConfirm: () => void;
  /** 오버레이 블러 여부 (기본 false — 안내 모달이므로 블러 없음) */
  overlayBlur?: boolean;
}

const FONT_BASE = { fontFamily: 'var(--font-pretendard)' } as const;

// Pretendard SemiBold 24px, lh 31.2px, ls -0.36px, #1A222E (VariableID:575:5006 = prime-900)
const TITLE_STYLE = {
  ...FONT_BASE,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  letterSpacing: '-0.36px',
  color: '#1A222E',
} as const;

// Pretendard Regular 16px, lh 25.6px, #3F526F (VariableID:575:5015 = prime-700)
const BODY_STYLE = {
  ...FONT_BASE,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '25.6px',
  color: '#3F526F',
} as const;


// Vector (icon): 40×28 inside 48×48 Frame, fill VariableID:576:5118 = #C57F08 (warning-500)
function NewSessionIcon() {
  return (
    <div style={{ width: 48, height: 48 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.231 38C6.31033 38 5.54167 37.6917 4.925 37.075C4.30833 36.4583 4 35.6897 4 34.769V13.231C4 12.3103 4.30833 11.5417 4.925 10.925C5.54167 10.3083 6.31033 10 7.231 10H40.769C41.6897 10 42.4583 10.3083 43.075 10.925C43.6917 11.5417 44 12.3103 44 13.231V34.769C44 35.6897 43.6917 36.4583 43.075 37.075C42.4583 37.6917 41.6897 38 40.769 38H7.231ZM7.769 29.3845H9.423V21.3845L14.831 29.3845H16.5385V18.6155H14.8845V26.6155L9.577 18.6155H7.769V29.3845ZM19.6155 29.3845H26.3845V27.731H21.3845V24.9155H26.3845V23.2615H21.3845V20.269H26.3845V18.6155H19.6155V29.3845ZM30.846 29.3845H38.846C39.259 29.3845 39.593 29.257 39.848 29.002C40.1033 28.7467 40.231 28.4127 40.231 28V18.6155H38.577V27.6155H35.6845V20.6155H34.031V27.6155H31.1155V18.6155H29.4615V28C29.4615 28.4127 29.589 28.7467 29.844 29.002C30.0993 29.257 30.4333 29.3845 30.846 29.3845Z"
          fill="#C57F08"
        />
      </svg>
    </div>
  );
}

export function ChatNewSessionModal({ isOpen, onClose, onConfirm, overlayBlur = false }: ChatNewSessionModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6" overlayBlur={overlayBlur}>

        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER, 302×281(HUG) */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER, 302×213(HUG) */}
          <div className="flex w-full flex-col items-center gap-6">

            {/* Frame 1597882687 — VERTICAL, gap 8, cross CENTER, 302×87(HUG) */}
            <div className="flex w-full flex-col items-center gap-2">
              {/* Frame (icon container) — 48×48, contains Vector 40×28, fill #C57F08 */}
              <NewSessionIcon />

              {/* 제목 — Pretendard SemiBold 24px, lh 31.2px, ls -0.36px, #1A222E, CENTER */}
              {/* VariableID:575:5006 = prime-900, style: Heading 02 */}
              <DialogTitle className="w-full text-center" style={TITLE_STYLE}>
                [새로운 상담] 버튼을 누르세요
              </DialogTitle>
            </div>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER, 302×52(HUG) */}
            <div className="flex w-full flex-col items-center gap-6">
              {/* 본문 — Pretendard Regular 16px, lh 25.6px, #3F526F, CENTER */}
              {/* VariableID:575:5015 = prime-700, style: Body 01 */}
              <DialogDescription className="w-full text-center" style={BODY_STYLE}>
                {'왼쪽 사이드바의 [상담] 버튼을 누르시면 \n새로운 상담을 진행하실 수 있습니다.'}
              </DialogDescription>
            </div>

            {/* 부가 안내 — Pretendard Regular 16px, lh 25.6px, #8A9BA8, CENTER */}
            {/* VariableID:575:5008 = tertiary-400, style: Body 01 */}
            <p className="w-full text-center" style={{ ...BODY_STYLE, color: '#8A9BA8' }}>
              (하루 1회씩 무료로 상담 가능합니다.)
            </p>
          </div>

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, cross CENTER, 302×44(HUG) */}
          {/* Button 확인 — Type=Primary, Symentic=Blue, layoutGrow:1 (FILL 302px)
              bg cta-300, radius 8, padding H24/V14 */}
          <Button
            variant="primary"
            onClick={onConfirm}
            className="w-full px-6"
          >
            확인
          </Button>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
