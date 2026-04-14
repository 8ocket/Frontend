'use client';

// Figma MODAL 14 (node 2113:9375) — 미완결 상담 알림
// Root: 350×335(HUG), VERTICAL, padding 24px all
// bg: VariableID:575:5007 = #F8FAFC (secondary-100)
// border: 2px INSIDE, VariableID:1243:2688 = rgba(141,194,238,0.30)
// radius: VariableID:1180:2200 = 12px
// props: Sementic Type=Yellow, Alarm=Information, Contents=미완결 상담

import { Button } from '@/shared/ui/button';
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
  /** 무시하기 버튼 클릭 */
  onIgnore: () => void;
  /** 진행한다 버튼 클릭 */
  onResume: () => void;
  /** 오버레이 블러 여부 (기본 true — 진입 시 강제 노출 모달이므로 블러) */
  overlayBlur?: boolean;
}



// Vector (icon): 30×37 inside 48×48 Frame (fill #ffffff), fill VariableID:576:5118 = #C57F08 (warning-500)
function UnfinishedSessionIcon() {
  return (
    <div className="h-12 w-12">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M23.993 42.769C23.1027 42.769 22.3428 42.4527 21.7135 41.82C21.0838 41.1873 20.769 40.4268 20.769 39.5385H27.231C27.231 40.4335 26.9138 41.1957 26.2795 41.825C25.6455 42.4543 24.8833 42.769 23.993 42.769ZM10 37.5385V35.5385H13.231V19.6925C13.231 17.0795 14.0578 14.7813 15.7115 12.798C17.3655 10.8147 19.4617 9.5795 22 9.0925V8C22 7.44433 22.194 6.97217 22.582 6.5835C22.97 6.1945 23.4412 6 23.9955 6C24.5498 6 25.0225 6.1945 25.4135 6.5835C25.8045 6.97217 26 7.44433 26 8V9.0925C26.5207 9.1925 27.0137 9.32 27.479 9.475C27.9443 9.63 28.395 9.82933 28.831 10.073L19.6925 19.123V30.3075H30.8385L34.769 26.377V35.5385H38V37.5385H10ZM24.4615 25.5385V21.119L35.127 10.504C35.3243 10.332 35.528 10.205 35.738 10.123C35.948 10.041 36.158 10 36.368 10C36.597 10 36.822 10.043 37.043 10.129C37.2643 10.2147 37.4653 10.3435 37.646 10.5155L39.496 12.404C39.6603 12.6013 39.7853 12.8063 39.871 13.019C39.957 13.232 40 13.4448 40 13.6575C40 13.8705 39.9653 14.0853 39.896 14.302C39.827 14.5187 39.6937 14.7257 39.496 14.923L28.881 25.5385H24.4615ZM36.381 15.569L38.231 13.6575L36.381 11.769L34.481 13.669L36.381 15.569Z"
          fill="#C57F08"
        />
      </svg>
    </div>
  );
}

export function ChatUnfinishedSessionModal({
  isOpen,
  onClose,
  sessionTitle,
  sessionDate,
  onIgnore,
  onResume,
  overlayBlur = true,
}: ChatUnfinishedSessionModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6" overlayBlur={overlayBlur}>

        {/* Frame 1597882320 — VERTICAL, gap 24, cross CENTER, 302×287(HUG) */}
        <div className="flex w-full flex-col items-center gap-6">

          {/* Frame 1597882318 — VERTICAL, gap 24, cross CENTER, 302×219(HUG) */}
          <div className="flex w-full flex-col items-center gap-6">

            {/* Frame 1597882688 — VERTICAL, gap 8, cross CENTER, 302×87(HUG) */}
            <div className="flex w-full flex-col items-center gap-2">
              {/* Frame (icon container) — 48×48, fill #ffffff, contains Vector 30×37, fill #C57F08 */}
              <UnfinishedSessionIcon />

              {/* 제목 — Pretendard SemiBold 24px, lh 31.2px, ls -0.36px, #1A222E, CENTER */}
              {/* VariableID:575:5006 = prime-900, style: Heading 02 */}
              <DialogTitle className="heading-02 text-prime-900 w-full text-center">
                마무리가 안 된 상담이 있습니다
              </DialogTitle>
            </div>

            {/* Frame 1597881574 — VERTICAL, gap 24, cross CENTER, 302×52(HUG) */}
            <div className="flex w-full flex-col items-center gap-6">
              {/* 본문 — Pretendard Regular 16px, lh 25.6px, #3F526F, CENTER */}
              {/* VariableID:575:5015 = prime-700, style: Body 01 */}
              <DialogDescription className="body-1 text-prime-700 w-full text-center">
                {'이전에 중단되어 마무리가 되지 않은 \n상담이 있습니다. 돌아가서 진행하시습니까?'}
              </DialogDescription>
            </div>

            {/* Frame 1597881573 — VERTICAL, gap 4, cross CENTER, 173×32(HUG), FIXED width */}
            <div className="flex w-43.25 flex-col items-center gap-1">
              {/* 세션 제목 — Pretendard Medium 12px, lh 14.4px, ls -0.18px, #945F06, CENTER */}
              {/* VariableID:576:5117 = warning-700 */}
              <span
                className="w-full text-center text-xs font-medium leading-[120%] tracking-[-0.18px] text-warning-700"
              >
                [{sessionTitle}]
              </span>
              {/* 날짜 — Pretendard Medium 12px, lh 14.4px, ls -0.18px, #6983AA, CENTER */}
              {/* VariableID:575:5017 = prime-500 */}
              <span
                className="w-full text-center text-xs font-medium leading-[120%] tracking-[-0.18px] text-prime-500"
              >
                {sessionDate}
              </span>
            </div>
          </div>

          {/* Frame 1597882319 — HORIZONTAL, SPACE_BETWEEN, gap 24, cross CENTER, 302×44(HUG) */}
          <div className="flex w-full flex-row items-center justify-between gap-6">
            {/* 무시하기 — Type=Secondary, Symentic=Blue, 140×44, padding H24/V14 */}
            {/* VariableID:1168:2204 = secondary-100, stroke cta-300, text prime-600 */}
            <Button
              variant="secondary"
              onClick={onIgnore}
              className="w-35 shrink-0 px-6"
            >
              무시하기
            </Button>
            {/* 진행한다 — Type=Primary, Symentic=Blue, 140×44, padding H24/V14 */}
            {/* VariableID:1168:2213 = cta-300 (#82C9FF), text prime-900 */}
            <Button
              variant="primary"
              onClick={onResume}
              className="w-35 shrink-0 px-6"
            >
              진행한다
            </Button>
          </div>

        </div>
      </DialogContent>
    </DialogRoot>
  );
}
