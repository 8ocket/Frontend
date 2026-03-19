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
    // Root — VERTICAL, gap=4, max-w=450, hSizing=FIXED, vSizing=HUG
    <div
      className={[
        'flex max-w-112.5 flex-col gap-1',
        isAi ? 'items-start self-start' : 'items-end self-end',
      ].join(' ')}
    >
      {/* Header — HORIZONTAL, crossAxis=CENTER, gap=8, hSizing=HUG, vSizing=HUG */}
      <div className="flex flex-row items-center gap-2">
        {isAi ? (
          /* AI Persona Profile Photo — 21×21, r=9999, IMAGE */
          <div className="h-5.25 w-5.25 shrink-0 overflow-hidden rounded-full">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt={senderName} className="h-full w-full object-cover" />
            ) : (
              <div className="bg-secondary-300 h-full w-full" />
            )}
          </div>
        ) : userAvatarSrc ? (
          /* Custom user avatar (about 페이지 등 특정 컨텍스트) */
          <div className="h-5.25 w-5.25 shrink-0 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={userAvatarSrc} alt={senderName} className="h-full w-full object-cover" />
          </div>
        ) : (
          /* User Profile Photo — 21×21, fill=#ffffff, Vector 16×16 fill=#2b4764 */
          <UserProfilePhoto />
        )}

        {/* Sender name
            AI:   Pretendard 16px SemiBold(600) lh=130% fill=#2b4764
            User: Pretendard 16px Regular(400)  lh=160% fill=#2b4764 */}
        <span
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '16px',
            fontWeight: isAi ? 600 : 400,
            lineHeight: isAi ? '130%' : '160%',
            color: '#2b4764',
          }}
        >
          {senderName}
        </span>
      </div>

      {/* Bubble body — HORIZONTAL, crossAxis=CENTER, gap=10, pad=[T12,R16,B12,L16]
          hSizing=FILL, vSizing=HUG, r=16, stroke=#82c9ff 1px
          AI:   fill=#f1f5f9 @30%, backdropFilter=blur(25px)
          User: fill=#82c9ff @10%, backdropFilter=blur(12px), dropShadow */}
      <div
        className="w-full rounded-2xl px-4 py-3"
        style={
          isAi
            ? {
                background: 'rgba(241, 245, 249, 0.30)',
                border: '1px solid #82c9ff',
                backdropFilter: 'blur(25px)',
              }
            : {
                background: 'rgba(130, 201, 255, 0.10)',
                border: '1px solid #82c9ff',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 2px 8px rgba(130, 201, 255, 0.20)',
              }
        }
      >
        {/* Text — hSizing=FILL, vSizing=FILL, grow=1
            Pretendard 16px Regular(400) lh=160% fill=#1a222e */}
        <p
          className="whitespace-pre-wrap"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '160%',
            color: '#1a222e',
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}
