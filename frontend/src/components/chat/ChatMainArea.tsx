'use client';

import { useState } from 'react';

import { ChatBubble, ChatBubbleProps } from './ChatBubble';
import { ChatInputBar } from './ChatInputBar';
import { ChatLogo } from './ChatLogo';
import { ChatSelectOptions, PersonaOption } from './ChatSelectOptions';

// Figma 1357:3355 — Frame 1597881480
// 1074×884, fill cta-300, radius 24

export interface ChatMainAreaProps {
  /** 상담 종료 확인 시 호출 (종료 확인 모달 표시) */
  onEndChat?: () => void;
  /** 크레딧 부족 시 호출 */
  onCreditShortage?: () => void;
  /** 미완결 상담 발견 시 호출 */
  onUnfinishedSession?: () => void;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  { id: 'mental', label: '정신건강 상담사' },
  { id: 'career', label: '직업 및 진로 상담사' },
  { id: 'coaching', label: '코칭 심리 상담사' },
];

// Figma 샘플 메시지
const INITIAL_MESSAGES: ChatBubbleProps[] = [
  {
    variant: 'ai',
    senderName: '정신건강 상담사',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    variant: 'user',
    senderName: 'User Name',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
];

export function ChatMainArea({ onEndChat, onCreditShortage, onUnfinishedSession }: ChatMainAreaProps = {}) {
  const [messages, setMessages] = useState<ChatBubbleProps[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [showSelectOptions, setShowSelectOptions] = useState(false);

  function handleSend() {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { variant: 'user', senderName: 'User Name', content: inputValue.trim() },
    ]);
    setInputValue('');
    setShowSelectOptions(false);
  }

  function handlePersonaSelect(option: PersonaOption) {
    setMessages((prev) => [
      ...prev,
      { variant: 'ai', senderName: option.label, content: '안녕하세요! 무엇을 도와드릴까요?' },
    ]);
    setShowSelectOptions(false);
  }

  return (
    <div
      className="relative flex flex-1 flex-col overflow-hidden rounded-3xl"
      style={{
        background: 'rgba(130, 201, 255, 0.10)',
        backdropFilter: 'blur(25px)',
      }}
    >
      {/* Background logo — Figma 1382:2757, left=156px top=2px within chat frame, opacity 0.1 */}
      <div
        className="pointer-events-none absolute"
        style={{ left: '156px', top: '2px', opacity: 0.1 }}
        aria-hidden="true"
      >
        <ChatLogo size={884} />
      </div>

      {/* Message scroll area */}
      <div className="relative flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {messages.map((msg, i) => (
          <ChatBubble key={i} {...msg} />
        ))}
      </div>

      {/* Input bar — Figma 1508:2473 */}
      <div className="relative">
        {/* Select Options popover — AI 교체 버튼 클릭 시 표시, 입력바 좌측 상단에 위치 */}
        {showSelectOptions && (
          <div className="absolute bottom-full left-6 mb-2">
            <ChatSelectOptions
              title="원하시는 상담사를 고르세요"
              options={PERSONA_OPTIONS}
              onSelect={handlePersonaSelect}
            />
          </div>
        )}
        <ChatInputBar
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onAiChange={() => setShowSelectOptions((prev) => !prev)}
        />
      </div>

    </div>
  );
}
