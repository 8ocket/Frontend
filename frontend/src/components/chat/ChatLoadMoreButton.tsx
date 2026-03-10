'use client';

// Figma 1363:2961 — Button (INSTANCE)
// 216×44, HORIZONTAL, fill secondary-100, stroke cta-300, pad T14 R24 B14 L24, radius 8
// Text: "최근 5일 이전 기록 더 보기" Medium 16px prime-600

type ChatLoadMoreButtonProps = {
  onClick?: () => void;
};

export function ChatLoadMoreButton({ onClick }: ChatLoadMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-cta-300 bg-secondary-100 text-prime-600 inline-flex h-11 w-54 items-center justify-center gap-2.5 whitespace-nowrap rounded-lg border px-6 py-3.5"
      style={{
        fontFamily: 'var(--font-pretendard)',
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '100%',
      }}
    >
      최근 5일 이전 기록 더 보기
    </button>
  );
}
