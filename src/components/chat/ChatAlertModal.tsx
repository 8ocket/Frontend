'use client';

// Figma MODAL 9 (2113:9201) — 상담 종료 확인
// 350×249, VERTICAL layout, padding 24px all, gap 24
// bg: secondary-100, border: 2px solid rgba(130,201,255,0.30), radius: 12

type EndModalProps = {
  variant: 'end';
  onWait: () => void;
  onEnd: () => void;
};

const MODAL_BASE =
  'bg-secondary-100 absolute inset-0 m-auto flex h-fit flex-col items-center gap-6 rounded-xl p-6';
const MODAL_BORDER = { border: '2px solid rgba(130, 201, 255, 0.30)' } as const;

const TITLE_STYLE = {
  fontFamily: 'var(--font-pretendard)',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '31.2px',
  color: '#BD1010',
} as const;

const BODY_STYLE = {
  fontFamily: 'var(--font-pretendard)',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '25.6px',
  color: '#3F526F',
} as const;

const BTN_STYLE = {
  fontFamily: 'var(--font-pretendard)',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '16px',
} as const;

export function ChatAlertModal(props: EndModalProps) {
  return (
    <div className={`${MODAL_BASE} w-87.5`} style={MODAL_BORDER}>
      {/* 제목 — Pretendard 24px/600, lh 31.2px, #BD1010, CENTER */}
      <span className="w-full text-center" style={TITLE_STYLE}>
        상담이 종료됩니다
      </span>

      {/* 본문 — Pretendard 16px/400, lh 25.6px, #3F526F, CENTER */}
      <p className="w-full text-center" style={BODY_STYLE}>
        현재까지 상담한 내역을 정리하여 마음기록으로 만듭니다. 마음기록 작성 이후부터는 해당
        상담창에서 상담이 불가능합니다. 진행하시겠습니까?
      </p>

      {/* 버튼 영역 — HORIZONTAL, SPACE_BETWEEN, gap 24 */}
      <div className="flex w-full flex-row items-center justify-between">
        {/* 대기한다 — outlined #BD1010, 104×44, padding H24/V14, radius 8 */}
        <button
          type="button"
          onClick={props.onWait}
          className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
          style={{ ...BTN_STYLE, borderColor: '#BD1010', color: '#BD1010' }}
        >
          대기한다
        </button>
        {/* 종료하기 — bg cta-300 (#82C9FF), text prime-900, 104×44, padding H24/V14, radius 8 */}
        <button
          type="button"
          onClick={props.onEnd}
          className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors"
          style={BTN_STYLE}
        >
          종료하기
        </button>
      </div>
    </div>
  );
}
