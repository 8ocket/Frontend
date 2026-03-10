'use client';

import { useState } from 'react';

import { MicIcon } from '@/components/icons/MicIcon';
import { SendIcon } from '@/components/icons/SendIcon';

// Figma 1508:2473 — Frame 1597881553
// 1026×84, HORIZONTAL, SPACE_BETWEEN, cross:CENTER

type ChatInputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAiChange?: () => void;
  onVoiceChat?: (isOn: boolean) => void;
  onEmotionSelect?: () => void;
  aiAvatarSrc?: string;
};

export function ChatInputBar({
  value,
  onChange,
  onSend,
  onAiChange,
  onVoiceChat,
  onEmotionSelect,
  aiAvatarSrc,
}: ChatInputBarProps) {
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const canSend = value.trim().length > 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  }

  function handleVoiceToggle() {
    const next = !isVoiceOn;
    setIsVoiceOn(next);
    onVoiceChat?.(next);
  }

  return (
    <div className="bg-secondary-100 flex w-full flex-row items-center justify-between">
      {/* Left tools — Figma 1508:2472, 290×80, radius [8,0,0,8] */}
      <div className="bg-secondary-100 flex h-20 shrink-0 flex-row items-center rounded-tl-lg px-0 py-1.75">
        <div className="flex flex-row items-center gap-6.5">

          {/* AI 교체 — avatar 44×44 + label */}
          <button
            type="button"
            onClick={onAiChange}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full">
              {aiAvatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aiAvatarSrc} alt="AI" className="h-full w-full object-cover" />
              ) : (
                <div className="bg-secondary-300 h-full w-full rounded-full" />
              )}
            </div>
            <span
              className="text-prime-700"
              style={{ fontFamily: 'var(--font-pretendard)', fontSize: '14px', fontWeight: 500, lineHeight: '100%' }}
            >
              AI 교체
            </span>
          </button>

          {/* 음성 상담 — Figma 1506:2450
              Off Default: icon #8a9ba8, no bg
              Off Hover:   icon #e2e8f0, bg #6d8292, r-4
              Off Pressed: icon #e2e8f0, bg #414e58, r-4
              On  Default: icon #10b981, no bg
              On  Hover:   icon #e2e8f0, bg #10b981, r-4
              On  Pressed: icon #e2e8f0, bg #085b40, r-4 */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className="group flex flex-col items-center gap-2"
          >
            <div
              className={[
                'flex h-11 w-11 items-center justify-center rounded-2xl transition-colors',
                isVoiceOn
                  ? 'group-hover:bg-success-700 group-active:bg-success-900'
                  : 'group-hover:bg-tertiary-500 group-active:bg-tertiary-700',
              ].join(' ')}
            >
              <MicIcon
                size={22}
                className={[
                  'transition-colors',
                  isVoiceOn
                    ? 'text-success-700 group-hover:text-neutral-300 group-active:text-neutral-300'
                    : 'text-tertiary-400 group-hover:text-neutral-300 group-active:text-neutral-300',
                ].join(' ')}
              />
            </div>
            <span
              className="text-prime-700"
              style={{ fontFamily: 'var(--font-pretendard)', fontSize: '14px', fontWeight: 500, lineHeight: '100%' }}
            >
              음성 상담
            </span>
          </button>

          {/* 감정 상태 — circle 40×40 + label */}
          <button
            type="button"
            onClick={onEmotionSelect}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center">
              <div className="bg-prime-700 h-10 w-10 rounded-full" />
            </div>
            <span
              className="text-prime-700"
              style={{ fontFamily: 'var(--font-pretendard)', fontSize: '14px', fontWeight: 500, lineHeight: '100%' }}
            >
              감정 상태
            </span>
          </button>

        </div>
      </div>

      {/* Right: Chatting Methods — Figma 1508:2553, 704×84 */}
      <div className="bg-secondary-100 flex h-21 flex-1 flex-row items-center gap-6 px-2 pt-2 pb-3">
        {/* Text Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Placeholder"
          className="border-neutral-300 bg-secondary-100 text-prime-900 placeholder:text-prime-900 flex h-11 flex-1 rounded-lg border px-4 py-3 outline-none"
          style={{ fontFamily: 'var(--font-pretendard)', fontSize: '14px', fontWeight: 400, lineHeight: '160%' }}
        />

        {/* Send button — Figma 1508:2533 (Type=Send, Size=64)
            Default:  border+icon #82c9ff
            Hover:    border+icon #4ba1f0
            Pressed:  border+icon #257cc0
            Disabled: border+icon #cacaca */}
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className={[
            'flex h-16 w-16 shrink-0 items-center justify-center rounded-full border bg-secondary-100 p-3 transition-colors',
            canSend
              ? 'border-cta-300 text-cta-300 hover:border-[#4ba1f0] hover:text-[#4ba1f0] active:border-[#257cc0] active:text-[#257cc0]'
              : 'cursor-not-allowed border-[#cacaca] text-[#cacaca]',
          ].join(' ')}
        >
          <SendIcon size={36} />
        </button>
      </div>
    </div>
  );
}
