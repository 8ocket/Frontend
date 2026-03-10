'use client';

// Figma 1512:3627 — "알려드립니다." (이전 상담 재개 안내)
// Figma 1520:3996 — "상담이 종료됩니다." (상담 종료 안내)
// 공통: 473×295, fill secondary-100, stroke cta-300 w:2, radius 12

type ResumeModalProps = {
  variant: 'resume';
  date: string;
  sessionTitle: string;
  onResume: () => void;
  onNewChat: () => void;
};

type EndModalProps = {
  variant: 'end';
  onEnd: () => void;
  onViewHistory: () => void;
};

type ChatAlertModalProps = ResumeModalProps | EndModalProps;

export function ChatAlertModal(props: ChatAlertModalProps) {
  if (props.variant === 'resume') {
    return (
      <div className="border-cta-300 bg-secondary-100 absolute inset-0 m-auto flex h-fit w-118.25 flex-col items-center justify-center gap-6 rounded-xl border-2 p-8">
        {/* Title — "알려드립니다." SemiBold 24px warning-500 */}
        <span
          className="text-warning-500 self-start"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '130%',
          }}
        >
          알려드립니다.
        </span>

        {/* Body content */}
        <div className="flex w-full flex-col items-center gap-6">
          {/* Description */}
          <p
            className="text-prime-700"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '150%',
            }}
          >
            이전에 상담하던 중 중단되어 마무리가 되지 못한 상담 내역이 있습니다.
            돌아가서 진행하시겠습니까?
          </p>

          {/* Session info */}
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-prime-700"
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '130%',
              }}
            >
              {props.date}
            </span>
            <span
              className="text-prime-700"
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '130%',
              }}
            >
              [{props.sessionTitle}]
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-3">
          {/* 돌아가기 — fill cta-300, Medium 16px, #1a222e, pad T14 R24 B14 L24, radius 8 */}
          <button
            type="button"
            onClick={props.onResume}
            className="bg-cta-300 text-prime-900 flex h-11 items-center justify-center rounded-lg px-6 py-3.5"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '100%',
            }}
          >
            돌아가기
          </button>
          {/* 새 채팅 — fill secondary-100, stroke cta-300, prime-600, radius 8 */}
          <button
            type="button"
            onClick={props.onNewChat}
            className="border-cta-300 bg-secondary-100 text-prime-600 flex h-11 items-center justify-center rounded-lg border px-6 py-3.5"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '100%',
            }}
          >
            새 채팅
          </button>
        </div>
      </div>
    );
  }

  // variant === 'end'
  return (
    <div className="border-cta-300 bg-secondary-100 absolute inset-0 m-auto flex h-fit w-118.25 flex-col items-center justify-center gap-6 rounded-xl border-2 p-8">
      {/* Title — "상담이 종료됩니다." SemiBold 24px error-400 */}
      <span
        className="text-error-400 self-start"
        style={{
          fontFamily: 'var(--font-pretendard)',
          fontSize: '24px',
          fontWeight: 600,
          lineHeight: '130%',
        }}
      >
        상담이 종료됩니다.
      </span>

      {/* Description */}
      <p
        className="text-prime-700 w-full"
        style={{
          fontFamily: 'var(--font-pretendard)',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '150%',
        }}
      >
        현재까지 상담한 내역들을 정리하여 리포트로 만듭니다. 현재 화면을 벗어나더라도
        리포트는 자동으로 만들어집니다.
      </p>

      {/* Buttons */}
      <div className="flex flex-row items-center gap-3">
        {/* 종료하기 — fill cta-300, Medium 16px, prime-900, radius 8 */}
        <button
          type="button"
          onClick={props.onEnd}
          className="bg-cta-300 text-prime-900 flex h-11 items-center justify-center rounded-lg px-6 py-3.5"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '100%',
          }}
        >
          종료하기
        </button>
        {/* 상담내역 확인 — fill secondary-100, stroke error-300, text error-300, radius 8 */}
        <button
          type="button"
          onClick={props.onViewHistory}
          className="border-error-300 bg-secondary-100 text-error-300 flex h-11 items-center justify-center rounded-lg border px-6 py-3.5"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '100%',
          }}
        >
          상담내역 확인
        </button>
      </div>
    </div>
  );
}
