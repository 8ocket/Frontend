'use client';

// Figma 1457:2703 (AI Bubble), 1457:2710 (User Bubble)
// Root: VERTICAL, gap=4, max-w=450px, vSizing=HUG

import { EmotionCard } from '@/widgets/emotion-card';
import type { EmotionCardData } from '@/entities/emotion';
import { ProfileAvatar } from '@/shared/ui/profile-avatar';

export type BubbleVariant = 'ai' | 'user';

export type ChatBubbleProps = {
  variant: BubbleVariant;
  senderName: string;
  content?: string;
  avatarSrc?: string;
  userAvatarSrc?: string;
  isLoading?: boolean;
  /** AI 버블에서 감정 카드를 표시할 때 사용. 설정 시 텍스트 대신 EmotionCard 렌더링. */
  emotionCardData?: EmotionCardData;
  /** 감정 카드 다운로드 URL (백엔드 생성 이미지) */
  cardImageUrl?: string;
};

export function ChatBubble({ variant, senderName, content, avatarSrc, userAvatarSrc, isLoading, emotionCardData, cardImageUrl }: ChatBubbleProps) {
  const isAi = variant === 'ai';
  const resolvedAvatarSrc = avatarSrc ?? '/images/personas/nabomi-44.png';

  const handleDownload = () => {
    if (!cardImageUrl) return;
    const link = document.createElement('a');
    link.href = cardImageUrl;
    link.download = `마음기록-${new Date().toISOString().slice(0, 10)}.jpg`;
    link.click();
  };

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolvedAvatarSrc} alt={senderName} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="border-cta-300 bg-cta-100 relative h-5.25 w-5.25 shrink-0 overflow-hidden rounded-full border">
            <ProfileAvatar src={userAvatarSrc} defaultPadding="p-1" />
          </div>
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
      {emotionCardData ? (
        <div className="flex flex-row items-end gap-2">
          <EmotionCard data={emotionCardData} size="sample" initialFace="front" />
          {cardImageUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-md transition-opacity hover:opacity-90 active:opacity-80"
              aria-label="마음 기록 카드 다운로드"
              style={{ background: '#82C9FF', fontFamily: 'Pretendard', fontSize: '16px', fontStyle: 'normal', fontWeight: 500, lineHeight: '100%', color: '#F8FAFC', textAlign: 'center' }}
            >
              다운로드
            </button>
          )}
        </div>
      ) : (
        <div
          className={[
            'w-fit rounded-2xl px-5 py-2.5 shadow-sm',
            isAi
              ? 'bg-white'
              : 'bg-[#4A90E2] text-white',
          ].join(' ')}
        >
          {isLoading ? (
            <div className="flex items-center gap-1.5 py-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-prime-300 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : (
            <p
              className={['whitespace-pre-wrap text-[15px] leading-[185%]', isAi ? 'text-prime-900' : 'text-white'].join(' ')}
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              {content}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
