'use client';

import Image from 'next/image';

// Figma: 가입 환영 및 보상 크레딧 지급 (13:56)

interface SignupCreditModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function SignupCreditModal({ isOpen, onConfirm }: SignupCreditModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(150deg, rgb(190, 219, 255) 0%, rgb(239, 246, 255) 50%, rgb(255, 255, 255) 100%)',
      }}
    >
      {/* 카드 */}
      <div className="flex w-full max-w-142 flex-col items-center gap-8 rounded-2xl border border-white/40 bg-white/70 px-10 py-10 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)]">
        {/* 로고 아이콘 */}
        <div className="relative size-12">
          <Image
            src="/images/logo/logo-small.svg"
            alt="MindLog"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-prime-600 text-sm tracking-[-0.21px]">
            가입해 주셔서 감사합니다
          </p>
          <p className="text-prime-900 text-2xl font-medium tracking-[-0.36px]">
            <span className="text-cta-400">150 크레딧</span> 지급 완료!
          </p>
          <div className="text-prime-500 space-y-0 text-center text-sm leading-normal tracking-[-0.21px]">
            <p>감사의 의미로 선물을 드립니다.</p>
            <p>마인드 로그와 함께 마음의 여정을 시작해보세요.</p>
          </div>
        </div>

        {/* CTA 버튼 */}
        <button
          type="button"
          onClick={onConfirm}
          className="bg-cta-300 h-14 w-full cursor-pointer rounded-xl text-base font-medium text-prime-900 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 active:opacity-80"
        >
          마인드 로그 시작하기
        </button>
      </div>
    </div>
  );
}
