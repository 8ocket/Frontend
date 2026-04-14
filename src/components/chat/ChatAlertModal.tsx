'use client';

// Figma MODAL 9 (node 2113:9201) — 상담 종료 확인
// Root: 350×305(HUG), VERTICAL, padding 24px all
// bg: VariableID:575:5007 = #F8FAFC (secondary-100)
// border: 2px INSIDE, VariableID:1243:2688 = rgba(141,194,238,0.30)
// radius: 12px

import { Button } from '@/shared/ui/button';
import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

export interface ChatAlertModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 대기한다 버튼 클릭 */
  onWait: () => void;
  /** 종료하기 버튼 클릭 */
  onEnd: () => void;
}



// Vector (icon): 36×36 inside 48×48 Frame, fill VariableID:576:5128 = #BD1010 (error-500)
function EndChatIcon() {
  return (
    <div className="h-12 w-12">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 31H31V17H17V31ZM24.0065 42C21.5175 42 19.1773 41.5277 16.986 40.583C14.795 39.6383 12.889 38.3563 11.268 36.737C9.647 35.1177 8.36383 33.2133 7.4185 31.024C6.47283 28.835 6 26.4958 6 24.0065C6 21.5175 6.47233 19.1773 7.417 16.986C8.36167 14.795 9.64367 12.889 11.263 11.268C12.8823 9.647 14.7867 8.36383 16.976 7.4185C19.165 6.47283 21.5042 6 23.9935 6C26.4825 6 28.8227 6.47233 31.014 7.417C33.205 8.36167 35.111 9.64367 36.732 11.263C38.353 12.8823 39.6362 14.7867 40.5815 16.976C41.5272 19.165 42 21.5042 42 23.9935C42 26.4825 41.5277 28.8227 40.583 31.014C39.6383 33.205 38.3563 35.111 36.737 36.732C35.1177 38.353 33.2133 39.6362 31.024 40.5815C28.835 41.5272 26.4958 42 24.0065 42Z" fill="#BD1010"/>
      </svg>
    </div>
  );
}

export function ChatAlertModal({ isOpen, onClose, onWait, onEnd }: ChatAlertModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">

        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER, 302×257(HUG) */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER, 302×189(HUG) */}
          <div className="flex w-full flex-col items-center gap-6">

            {/* Frame 1597882683 — VERTICAL, gap 8, cross CENTER, 302×87(HUG) */}
            <div className="flex w-full flex-col items-center gap-2">
              {/* Frame (icon container) — 48×48, contains Vector 36×36, fill #BD1010 */}
              <EndChatIcon />

              {/* 제목 — Pretendard SemiBold 24px, lh 31.2px, ls -0.36px, #1A222E, CENTER */}
              {/* VariableID:575:5006 = prime-900, style: Heading 02 */}
              <DialogTitle className="heading-02 text-prime-900 w-full text-center">
                상담이 종료됩니다
              </DialogTitle>
            </div>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER, 302×78(HUG) */}
            <div className="flex w-full flex-col items-center gap-6">
              {/* 본문 — Pretendard Regular 16px, lh 25.6px, #3F526F, CENTER */}
              {/* VariableID:575:5015 = prime-700, style: Body 01 */}
              <DialogDescription className="body-1 text-prime-700 w-full text-center">
                현재까지 상담한 내역을 정리하여 마음기록으로 만듭니다. 마음기록 작성 이후부터는 해당 상담창에서 상담이 불가능합니다. 진행하시겠습니까?
              </DialogDescription>
            </div>
          </div>

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, gap 24, cross CENTER, 302×44(HUG) */}
          <div className="flex w-full flex-row items-center justify-between gap-6">
            {/* 대기한다 — Type=Secondary, Symentic=Blue, 140×44, padding H24/V14 */}
            {/* VariableID:1168:2204 = secondary-100 fill, VariableID:1168:2213 = cta-300 stroke */}
            <Button
              variant="secondary"
              onClick={onWait}
              className="w-35 shrink-0 px-6"
            >
              대기한다
            </Button>
            {/* 종료하기 — Type=Primary, Symentic=Blue, 140×44, padding H24/V14 */}
            {/* VariableID:1168:2213 = cta-300 fill, VariableID:1168:2198 = prime-900 text */}
            <Button
              variant="primary"
              onClick={onEnd}
              className="w-35 shrink-0 px-6"
            >
              종료하기
            </Button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
