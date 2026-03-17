'use client';

// Figma: 회원가입시 포인트 지급 (1303:3182)
// 전체: fixed inset-0, bg secondary-100(#f8fafc), 카드 정중앙
// 카드: 414×192px, glass blue-20(rgba(130,201,255,0.2)) + backdrop-blur-20px
//       rounded-xl(16px), p-8(32px), gap-8(32px)
// 텍스트: Pretendard SemiBold 20px, prime-800(#2c3a4f), center, leading-1.3, tracking-[-0.3px]
// 버튼: bg cta-300(#82c9ff), px-6(24px) py-3.5(14px), rounded-lg(8px),
//        text prime-900(#1a222e) Medium 16px

interface SignupCreditModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function SignupCreditModal({ isOpen, onConfirm }: SignupCreditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-100 dark:bg-prime-950">
      <div
        className="flex w-[414px] flex-col items-center gap-8 rounded-xl p-8"
        style={{
          background: 'rgba(130, 201, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* 텍스트 — Figma: 1303:3183, SemiBold 20px, prime-800, center */}
        <p className="text-prime-800 text-center text-xl font-semibold leading-[1.3] tracking-[-0.3px]">
          가입해 주셔서 감사드립니다.<br />
          감사의 의미로 150 크레딧을 선물로 드립니다.
        </p>

        {/* 버튼 — Figma: 1357:2990, cta-300 bg, px-24 py-14, rounded-8 */}
        <button
          type="button"
          onClick={onConfirm}
          className="bg-cta-300 text-prime-900 cursor-pointer rounded-lg px-6 py-3.5 text-base font-medium leading-none transition-opacity hover:opacity-90 active:opacity-80"
        >
          확인
        </button>
      </div>
    </div>
  );
}
