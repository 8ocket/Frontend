'use client';

// Figma 1457:2703 (AI Bubble), 1457:2710 (User Bubble)
// Root: VERTICAL, gap=4, max-w=450px, vSizing=HUG

export type BubbleVariant = 'ai' | 'user';

export type ChatBubbleProps = {
  variant: BubbleVariant;
  senderName: string;
  content: string;
  avatarSrc?: string;
  userAvatarSrc?: string;
};

// User Profile Photo — 21×21 흰 원 + 사용자 실루엣 벡터 (fill=#2b4764)
function UserProfilePhoto() {
  return (
    <div className="flex h-5.25 w-5.25 shrink-0 items-center justify-center rounded-full bg-white">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 8C9.933 8 11.5 6.433 11.5 4.5C11.5 2.567 9.933 1 8 1C6.067 1 4.5 2.567 4.5 4.5C4.5 6.433 6.067 8 8 8Z"
          fill="#2b4764"
        />
        <path
          d="M8 9.5C4.686 9.5 2 11.01 2 12.875V14H14V12.875C14 11.01 11.314 9.5 8 9.5Z"
          fill="#2b4764"
        />
      </svg>
    </div>
  );
}

export function ChatBubble({ variant, senderName, content, avatarSrc, userAvatarSrc }: ChatBubbleProps) {
  const isAi = variant === 'ai';

  return (
    <div
      className={[
        'flex max-w-[60%] flex-col gap-1',
        isAi ? 'items-start self-start' : 'items-end self-end',
      ].join(' ')}
    >
      {/* Header */}
      <div className={['flex flex-row items-center gap-2', isAi ? '' : 'flex-row-reverse'].join(' ')}>
        {isAi ? (
          <div className="h-5.25 w-5.25 shrink-0 overflow-hidden rounded-full">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt={senderName} className="h-full w-full object-cover" />
            ) : (
              <div className="bg-secondary-300 h-full w-full" />
            )}
          </div>
        ) : userAvatarSrc ? (
          <div className="h-5.25 w-5.25 shrink-0 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={userAvatarSrc} alt={senderName} className="h-full w-full object-cover" />
          </div>
        ) : (
          <UserProfilePhoto />
        )}

        {/* TODO: 타이포그래피 토큰으로 전환 → isAi ? "subtitle-1" : "body-2" + text-prime-500 */}
        <span
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: isAi ? 600 : 400,
            lineHeight: '130%',
            color: 'var(--color-prime-500)',
          }}
        >
          {senderName}
        </span>
      </div>

      {/* Bubble body */}
      <div
        className={[
          'w-full rounded-2xl px-5 py-4 shadow-sm',
          isAi
            ? 'border border-slate-100 bg-white'
            : 'bg-main-blue text-white',
        ].join(' ')}
      >
        <p
          className={['whitespace-pre-wrap text-[15px] leading-[165%]', isAi ? 'text-prime-900' : 'text-white'].join(' ')}
          style={{ fontFamily: 'var(--font-pretendard)' }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}
