'use client';

// Figma AI 상담 섹션 모달
// MODAL 14 (2113:9375) — "마무리가 안 된 상담이 있습니다"  → variant: 'resume'
// MODAL 10 (2113:9240) — "크레딧이 부족합니다"             → variant: 'credit'
// MODAL 11 (2113:9317) — "[새로운 상담] 버튼을 누르세요"   → variant: 'newChat'
// Figma 1520:3996       — "상담이 종료됩니다."              → variant: 'end'
// 공통: bg secondary-100, border 2px solid rgba(130,201,255,0.30), radius 12, padding 24, gap 24

type ResumeModalProps = {
  variant: 'resume';
  date: string;
  sessionTitle: string;
  onResume: () => void;
  onNewChat: () => void;
};

type CreditModalProps = {
  variant: 'credit';
  remainingCredits: number;
  onEnd: () => void;
  onBuy: () => void;
};

type NewChatModalProps = {
  variant: 'newChat';
  onConfirm: () => void;
};

type EndModalProps = {
  variant: 'end';
  onEnd: () => void;
  onViewHistory: () => void;
};

type ChatAlertModalProps = ResumeModalProps | CreditModalProps | NewChatModalProps | EndModalProps;

const MODAL_BASE =
  'bg-secondary-100 absolute inset-0 m-auto flex h-fit flex-col items-center gap-6 rounded-xl p-6';
const MODAL_BORDER = { border: '2px solid rgba(130, 201, 255, 0.30)' } as const;

const TITLE_STYLE = {
  fontFamily: 'var(--font-pretendard)',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '130%',
} as const;

const BODY_STYLE = {
  fontFamily: 'var(--font-pretendard)',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '160%',
  color: '#3F526F',
} as const;

const BTN_STYLE = {
  fontFamily: 'var(--font-pretendard)',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '100%',
} as const;

export function ChatAlertModal(props: ChatAlertModalProps) {
  // ── MODAL 14: 마무리가 안 된 상담이 있습니다 ──────────────────────────
  if (props.variant === 'resume') {
    return (
      <div className={`${MODAL_BASE} w-87.5`} style={MODAL_BORDER}>
        {/* Title — SemiBold 24px, #C57F08, center */}
        <span className="w-full text-center" style={{ ...TITLE_STYLE, color: '#C57F08' }}>
          마무리가 안 된 상담이 있습니다
        </span>

        {/* Body */}
        <div className="flex w-full flex-col items-center gap-6">
          <p className="w-full text-center" style={BODY_STYLE}>
            이전에 중단되어 마무리가 되지 않은{'\n'}상담이 있습니다. 돌아가서 진행하시습니까?
          </p>

          {/* Session info: [title] → date */}
          <div className="flex flex-col items-center gap-1">
            <span
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '130%',
                color: '#945F06',
              }}
            >
              [{props.sessionTitle}]
            </span>
            <span
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '130%',
                color: '#6983AA',
              }}
            >
              {props.date}
            </span>
          </div>
        </div>

        {/* Buttons: 무시한다 (outlined #945F06) / 진행한다 (cta-300 filled) */}
        <div className="flex w-full flex-row items-center justify-between">
          <button
            type="button"
            onClick={props.onNewChat}
            className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
            style={{ ...BTN_STYLE, borderColor: '#945F06', color: '#945F06' }}
          >
            무시한다
          </button>
          <button
            type="button"
            onClick={props.onResume}
            className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors hover:bg-[#4BA1F0] active:bg-[#257CC0]"
            style={BTN_STYLE}
          >
            진행한다
          </button>
        </div>
      </div>
    );
  }

  // ── MODAL 10: 크레딧이 부족합니다 ────────────────────────────────────
  if (props.variant === 'credit') {
    return (
      <div className={`${MODAL_BASE} w-87.5`} style={MODAL_BORDER}>
        {/* Title — SemiBold 24px, #BD1010, center */}
        <span className="w-full text-center" style={{ ...TITLE_STYLE, color: '#BD1010' }}>
          크레딧이 부족합니다
        </span>

        {/* Body */}
        <div className="flex w-full flex-col items-center gap-4">
          <p className="w-full text-center" style={BODY_STYLE}>
            크레딧 부족으로 추가 상담을 진행할 수 없습니다. 크레딧을 구매하시겠습니까?
          </p>

          {/* 잔여 크레딧 */}
          <div className="flex flex-row items-center gap-1">
            <span
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '16px',
                fontWeight: 400,
                color: '#8A9BA8',
              }}
            >
              잔여 크레딧 :{' '}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '16px',
                fontWeight: 400,
                color: '#0B63F3',
              }}
            >
              {props.remainingCredits}
            </span>
          </div>
        </div>

        {/* Buttons: 종료하기 (outlined #BD1010) / 구매하기 (cta-300 filled) */}
        <div className="flex w-full flex-row items-center justify-between">
          <button
            type="button"
            onClick={props.onEnd}
            className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
            style={{ ...BTN_STYLE, borderColor: '#BD1010', color: '#BD1010' }}
          >
            종료하기
          </button>
          <button
            type="button"
            onClick={props.onBuy}
            className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors hover:bg-[#4BA1F0] active:bg-[#257CC0]"
            style={BTN_STYLE}
          >
            구매하기
          </button>
        </div>
      </div>
    );
  }

  // ── MODAL 11: [새로운 상담] 버튼을 누르세요 ──────────────────────────
  if (props.variant === 'newChat') {
    return (
      <div className={`${MODAL_BASE} w-87.5`} style={MODAL_BORDER}>
        {/* Title — SemiBold 24px, #C57F08, center */}
        <span className="w-full text-center" style={{ ...TITLE_STYLE, color: '#C57F08' }}>
          [새로운 상담] 버튼을 누르세요
        </span>

        {/* Body */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="w-full text-center" style={BODY_STYLE}>
            왼쪽 사이드바의 [상담] 버튼을 누르시면{'\n'}새로운 상담을 진행하실 수 있습니다.
          </p>
          <span
            className="text-center"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '16px',
              fontWeight: 400,
              color: '#8A9BA8',
            }}
          >
            (하루 1회씩 무료로 상담 가능합니다.)
          </span>
        </div>

        {/* Button: 확인 (cta-300 filled, single) */}
        <button
          type="button"
          onClick={props.onConfirm}
          className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors hover:bg-[#4BA1F0] active:bg-[#257CC0]"
          style={BTN_STYLE}
        >
          확인
        </button>
      </div>
    );
  }

  // ── variant === 'end': 상담이 종료됩니다 ─────────────────────────────
  // Figma 1520:3996 — 473x295, title #ef4444, body "리포트", buttons: 종료하기(blue) / 상담내역 확인(outlined #f37373)
  return (
    <div className={`${MODAL_BASE} w-118.25`} style={MODAL_BORDER}>
      {/* Title — Pretendard SemiBold 24px, #ef4444, center */}
      <span className="w-full text-center" style={{ ...TITLE_STYLE, color: '#ef4444' }}>
        상담이 종료됩니다.
      </span>

      {/* Description — Pretendard Regular 16px, #3f526f, center */}
      <p className="w-full text-center" style={BODY_STYLE}>
        현재까지 상담한 내역들을 정리하여 리포트로 만듭니다. 현재 화면을 벗어나더라도 리포트는
        자동으로 만들어집니다.
      </p>

      {/* Buttons */}
      <div className="flex w-full flex-row items-center justify-between">
        {/* 종료하기 — Primary/Blue */}
        <button
          type="button"
          onClick={props.onEnd}
          className="bg-cta-300 text-prime-900 flex items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 transition-colors hover:bg-[#4BA1F0] active:bg-[#257CC0]"
          style={BTN_STYLE}
        >
          종료하기
        </button>
        {/* 상담내역 확인 — Outlined/Red */}
        <button
          type="button"
          onClick={props.onViewHistory}
          className="flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3.5 transition-colors"
          style={{ ...BTN_STYLE, borderColor: '#f37373', color: '#f37373' }}
        >
          상담내역 확인
        </button>
      </div>
    </div>
  );
}
