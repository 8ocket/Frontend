'use client';

import { useState } from 'react';

import { MicIcon } from '@/components/icons/MicIcon';
import { SendIcon } from '@/components/icons/SendIcon';
import { Input } from '@/shared/ui/input';

// Figma 1512:3708 — 채팅 (full chatbar)
// 1058×52, HORIZONTAL, gap:8, cross:CENTER, fill:secondary-100, radius:16

type ChatInputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceChat?: (isOn: boolean) => void;
  onEndChat?: () => void;
};

export function ChatInputBar({
  value,
  onChange,
  onSend,
  onVoiceChat,
  onEndChat,
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
    <div className="bg-secondary-100 flex h-13 w-full flex-row items-center justify-between gap-2 rounded-2xl">
      {/* Left tools — 모바일에서 축소 */}
      <div className="flex shrink-0 flex-row items-center md:h-13 md:w-34">
        <div className="flex flex-row items-center gap-2 md:gap-4">
          {/* 상담 종료 — Figma 1845:6269 (Size=44)
              Default: frame white, icon #EF4444, text #3F526F
              Pressed: frame #BD1010, icon #E2E8F0
              (Hover 상태 없음) */}
          <button
            type="button"
            onClick={onEndChat}
            className="group flex h-11 w-13 flex-col items-center justify-center gap-2"
          >
            <div className="flex h-5.5 w-5.5 items-center justify-center overflow-hidden rounded bg-white transition-colors group-hover:bg-[#EF4444] group-active:bg-[#BD1010]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm3.5 12.5-1.06 1.06L11 13.06l-2.44 2.5L7.5 14.5 9.94 12 7.5 9.56l1.06-1.06L11 10.94l2.44-2.44 1.06 1.06L12.06 12l2.44 2.5z"
                  fill="currentColor"
                  className="text-[#EF4444] transition-colors group-hover:text-[#E2E8F0] group-active:text-[#E2E8F0]"
                />
              </svg>
            </div>
            <span
              className="text-[#3F526F]"
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
              }}
            >
              상담 종료
            </span>
          </button>

          {/* 음성 상담 — Figma 1506:2450 (Size=44)
              Off Default: frame white, icon #8A9BA8, text #3F526F
              Off Hover:   frame #6D8292, icon #E2E8F0
              Off Pressed: frame #414E58, icon #E2E8F0
              On  Default: frame white, icon #10B981, text #3F526F
              On  Hover:   frame #10B981, icon #E2E8F0
              On  Pressed: frame #085B40, icon #E2E8F0 */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className="group flex h-11 w-13 flex-col items-center justify-center gap-2"
          >
            <div
              className={[
                'flex h-5.5 w-5.5 items-center justify-center overflow-hidden rounded bg-white transition-colors',
                isVoiceOn
                  ? 'group-hover:bg-[#10B981] group-active:bg-[#085B40]'
                  : 'group-hover:bg-[#6D8292] group-active:bg-[#414E58]',
              ].join(' ')}
            >
              <MicIcon
                size={11}
                className={[
                  'transition-colors',
                  isVoiceOn
                    ? 'text-[#10B981] group-hover:text-[#E2E8F0] group-active:text-[#E2E8F0]'
                    : 'text-[#8A9BA8] group-hover:text-[#E2E8F0] group-active:text-[#E2E8F0]',
                ].join(' ')}
              />
            </div>
            <span
              className="text-[#3F526F]"
              style={{
                fontFamily: 'var(--font-pretendard)',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
              }}
            >
              음성 상담
            </span>
          </button>
        </div>
      </div>

      {/* Right: Chatting Methods — Figma 1512:3708, 914×52, pad:4, gap:24 */}
      <div className="bg-secondary-100 flex h-13 flex-1 flex-row items-center gap-6 rounded-lg p-1">
        {/* Text Input — 44px, fill #E2E8F0, stroke #F1F5F9, pad:12/16 */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="채팅을 입력하세요"
          className="text-prime-900 placeholder:text-prime-900 flex-1 border-[#F1F5F9] bg-[#E2E8F0] text-sm"
        />

        {/* Send button — 44×44, fill secondary-100, stroke #CACACA, radius:full
            Default:  border+icon cta-300 (#82c9ff)
            Hover:    border+icon #4ba1f0
            Pressed:  border+icon #257cc0
            Disabled: border+icon #cacaca */}
        <button
          type="button"
          onClick={onSend}
          disabled={!isVoiceOn && !canSend}
          className={[
            'bg-secondary-100 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border p-2 transition-colors',
            isVoiceOn
              ? 'border-[#10B981] text-[#10B981] hover:border-[#0A8C60] hover:text-[#0A8C60] active:border-[#085B40] active:text-[#085B40]'
              : canSend
                ? 'border-cta-300 text-cta-300 hover:border-[#4ba1f0] hover:text-[#4ba1f0] active:border-[#257cc0] active:text-[#257cc0]'
                : 'cursor-not-allowed border-[#cacaca] text-[#cacaca]',
          ].join(' ')}
        >
          <SendIcon size={24} />
        </button>
      </div>
    </div>
  );
}
