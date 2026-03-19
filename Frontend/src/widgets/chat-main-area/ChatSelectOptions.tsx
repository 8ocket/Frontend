'use client';

// Figma 1508:2484 — Select Options Component
// 187×136, VERTICAL, pad 8 all, gap 8, radius 8, fill secondary-100

export type PersonaOption = {
  id: string;
  label: string;
  avatarSrc?: string;
};

type ChatSelectOptionsProps = {
  title: string;
  options: PersonaOption[];
  onSelect?: (option: PersonaOption) => void;
};

export function ChatSelectOptions({ title, options, onSelect }: ChatSelectOptionsProps) {
  return (
    <div
      className="bg-secondary-100 flex w-46.75 flex-col gap-2 rounded-lg p-2"
      style={{ boxShadow: '4px 4px 4px 0 rgba(0, 0, 0, 0.25)' }}
    >
      {/* Header — "원하시는 상담사를 고르세요" */}
      <div className="flex flex-row items-center gap-2">
        <span
          className="text-prime-900"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '130%',
          }}
        >
          {title}
        </span>
      </div>

      {/* Option list — each 170×25, pad 2, gap 8, radius 4 */}
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect?.(option)}
          className="flex w-42.5 flex-row items-center gap-2 rounded p-0.5 transition-colors hover:bg-neutral-200"
        >
          {/* Avatar 21×21 */}
          <div className="flex h-5.25 w-5.25 shrink-0 items-center justify-center overflow-hidden rounded-full">
            {option.avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={option.avatarSrc} alt={option.label} className="h-full w-full object-cover" />
            ) : (
              <div className="bg-secondary-300 h-full w-full rounded-full" />
            )}
          </div>
          {/* Label */}
          <span
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '100%',
              color: '#3f526f',
            }}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
