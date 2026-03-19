'use client';

// Figma MODAL 9 (2113:9201) — 상담 종료 확인
// 350×249, VERTICAL layout, padding 24px all, gap 24
// bg: secondary-100, border: 2px solid rgba(130,201,255,0.30), radius: 12

import { Button } from '@/shared/ui/button';
import { DialogRoot, DialogContent, DialogTitle } from '@/shared/ui/dialog';

type EndModalProps = {
  variant: 'end';
  onWait: () => void;
  onEnd: () => void;
};

export function ChatAlertModal(props: EndModalProps) {
  return (
    <DialogRoot open onOpenChange={(open) => !open && props.onWait()}>
      <DialogContent maxWidth="max-w-[350px]" showClose={false}>
        {/* 제목 — Pretendard 24px/600, #BD1010, CENTER */}
        <DialogTitle className="text-center text-2xl font-semibold text-error-600">
          상담이 종료됩니다
        </DialogTitle>

        {/* 본문 — Pretendard 16px/400, #3F526F, CENTER */}
        <p className="text-prime-700 mt-6 text-center text-base leading-[1.6]">
          현재까지 상담한 내역을 정리하여 마음기록으로 만듭니다. 마음기록 작성 이후부터는 해당
          상담창에서 상담이 불가능합니다. 진행하시겠습니까?
        </p>

        {/* 버튼 영역 — HORIZONTAL, SPACE_BETWEEN */}
        <div className="mt-6 flex w-full items-center justify-between gap-6">
          <Button
            variant="secondary"
            semantic="red"
            onClick={props.onWait}
            className="flex-1"
          >
            대기한다
          </Button>
          <Button
            variant="primary"
            onClick={props.onEnd}
            className="flex-1"
          >
            종료하기
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
