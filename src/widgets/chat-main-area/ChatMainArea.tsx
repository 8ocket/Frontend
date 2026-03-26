'use client';

import { useState, useEffect } from 'react';

import { ChatBubble, ChatBubbleProps } from './ChatBubble';
import { ChatInputBar } from '@/features/send-message';
import { ChatLogo } from './ChatLogo';
import { type PersonaOption } from './ChatSelectOptions';

// Figma 1357:3355 — Frame 1597881480
// 1074×884, fill cta-300, radius 24

export interface ChatMainAreaProps {
  /** 상담 종료 확인 시 호출 (종료 확인 모달 표시) */
  onEndChat?: () => void;
  /** 크레딧 부족 시 호출 */
  onCreditShortage?: () => void;
  /** 미완결 상담 발견 시 호출 */
  onUnfinishedSession?: () => void;
  /** 표시할 메시지 목록 */
  initialMessages?: ChatBubbleProps[];
  /** 활성 세션 여부 — false면 입력창 비활성화 */
  isSessionActive?: boolean;
  /** 비활성 입력창/전송 버튼 클릭 시 호출 */
  onDisabledInputClick?: () => void;
  /** 외부에서 채팅에 추가할 메시지 — 변경될 때마다 목록에 append */
  appendMessage?: ChatBubbleProps | null;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  { id: 'mental', label: '정신건강 상담사' },
  { id: 'career', label: '직업 및 진로 상담사' },
  { id: 'coaching', label: '코칭 심리 상담사' },
];

export function ChatMainArea({ onEndChat, onCreditShortage, onUnfinishedSession, initialMessages = [], isSessionActive = true, onDisabledInputClick, appendMessage }: ChatMainAreaProps = {}) {
  const [messages, setMessages] = useState<ChatBubbleProps[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [showSelectOptions, setShowSelectOptions] = useState(false);

  // 세션 변경 시 메시지 교체
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // 외부에서 메시지 추가 (예: 종료 시 "마음 기록 제작 중")
  useEffect(() => {
    if (appendMessage) {
      setMessages((prev) => [...prev, appendMessage]);
    }
  }, [appendMessage]);

  function handleSend() {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { variant: 'user', senderName: 'User Name', content: inputValue.trim() },
    ]);
    setInputValue('');
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-[#F8FAFF]">
      {/* Background logo */}
      <div
        className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex"
        style={{ opacity: 0.07 }}
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

      {/* Input bar — Figma 1512:3708 */}
      <div className="relative px-3 pb-3">
        {/* Select Options popover — AI 교체 버튼 클릭 시 표시, 입력바 좌측 상단에 위치 */}
        <ChatInputBar
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onEndChat={onEndChat}
          disabled={!isSessionActive}
          onDisabledClick={onDisabledInputClick}
        />
      </div>

    </div>
  );
}
