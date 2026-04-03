'use client';

import { useState, useEffect, useRef } from 'react';

import { ChatBubble, ChatBubbleProps } from './ChatBubble';
import { ChatInputBar } from '@/features/send-message';
import { sendMessageStream } from '@/features/send-message/sendMessageStream';
import { createSessionStream } from '@/entities/session/api';
import { ChatLogo } from './ChatLogo';
import { getCookie } from '@/shared/lib/utils/cookie';

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
  /** 현재 세션 ID — 메시지 전송 시 사용. undefined면 첫 메시지 시 세션 생성 */
  sessionId?: string;
  /** 세션 생성에 사용할 페르소나 ID */
  personaId?: string;
  /** 세션 생성 완료 시 호출 — 페이지에서 activeSessionId 업데이트 용도 */
  onSessionCreated?: (sessionId: string) => void;
  /** AI 상담사 표시 이름 */
  aiName?: string;
  /** AI 상담사 아바타 이미지 URL */
  aiAvatarSrc?: string;
}

export function ChatMainArea({
  onEndChat,
  onCreditShortage: _onCreditShortage,
  onUnfinishedSession: _onUnfinishedSession,
  initialMessages = [],
  isSessionActive = true,
  onDisabledInputClick,
  appendMessage,
  sessionId,
  personaId,
  onSessionCreated,
  aiName = '나봄이',
  aiAvatarSrc = '/images/personas/nabomi-44.png',
}: ChatMainAreaProps = {}) {
  const [messages, setMessages] = useState<ChatBubbleProps[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevSessionIdRef = useRef<string | undefined>(sessionId);
  // handleSend에서 세션을 직접 생성한 경우 true → sessionId 변경 시 메시지 유지
  const justCreatedSessionRef = useRef(false);

  // 세션 전환 시 메시지 교체 (sessionId 기준으로 판단)
  useEffect(() => {
    const prevId = prevSessionIdRef.current;
    prevSessionIdRef.current = sessionId;

    if (prevId === sessionId) return;

    if (sessionId === undefined) {
      // 새 세션 시작 준비 → 메시지 초기화
      setMessages([]);
      return;
    }

    if (justCreatedSessionRef.current) {
      // 방금 이 컴포넌트에서 세션을 생성한 경우 → 기존 메시지 유지
      justCreatedSessionRef.current = false;
      return;
    }

    // 이어가기 / 사이드바 세션 선택 → initialMessages 로드
    setMessages(initialMessages);
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 외부에서 메시지 추가 (예: 종료 시 "마음 기록 제작 중")
  useEffect(() => {
    if (appendMessage) {
      setMessages((prev) => [...prev, appendMessage]);
    }
  }, [appendMessage]);

  // 메시지 추가 또는 스트리밍 업데이트 시 스크롤 하단으로
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  async function handleSend() {
    if (!inputValue.trim() || isStreaming) return;

    const content = inputValue.trim();
    setInputValue('');

    setMessages((prev) => [...prev, { variant: 'user', senderName: 'User Name', content }]);

    const token = getCookie('accessToken') ?? '';

    // 세션 없음 → 첫 메시지: 세션 생성 SSE
    if (!sessionId) {
      setIsStreaming(true);
      setStreamingText('');
      let accumulated = '';
      let createdSessionId = '';

      try {
        await createSessionStream(
          { first_content: content },
          token,
          (chunk) => {
            accumulated += chunk;
            setStreamingText(accumulated);
          },
          (data) => {
            createdSessionId = data.session_id;
          },
          (_title) => {
            // session_title 이벤트 — 필요 시 사이드바 갱신에 활용
          },
          () => {
            setMessages((prev) => [
              ...prev,
              { variant: 'ai', senderName: aiName, content: accumulated, avatarSrc: aiAvatarSrc },
            ]);
            setStreamingText('');
            setIsStreaming(false);
            justCreatedSessionRef.current = true;
            if (createdSessionId) onSessionCreated?.(createdSessionId);
          },
          (errMsg) => {
            console.error('Session create SSE error:', errMsg);
            setIsStreaming(false);
            setStreamingText('');
          }
        );
      } catch (err) {
        console.error('Session create error:', err);
        setIsStreaming(false);
        setStreamingText('');
      }
      return;
    }

    // 세션 있음 → 이후 메시지: SSE 스트리밍
    setIsStreaming(true);
    setStreamingText('');

    let accumulated = '';

    try {
      await sendMessageStream(
        sessionId,
        content,
        token,
        (chunk) => {
          accumulated += chunk;
          setStreamingText(accumulated);
        },
        (msg) => {
          // TODO: 위기 감지 모달 연결
          console.warn('Crisis detected:', msg);
        },
        () => {
          setMessages((prev) => [
            ...prev,
            { variant: 'ai', senderName: aiName, content: accumulated, avatarSrc: aiAvatarSrc },
          ]);
          setStreamingText('');
          setIsStreaming(false);
        }
      );
    } catch (err) {
      console.error('Stream error:', err);
      setIsStreaming(false);
      setStreamingText('');
    }
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-3xl">
      {/* Background logo */}
      <div
        className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex"
        style={{ opacity: 0.07 }}
        aria-hidden="true"
      >
        <ChatLogo size={884} />
      </div>

      {/* Message scroll area */}
      <div
        ref={scrollRef}
        className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 pb-28"
      >
        {messages.map((msg, i) => (
          <ChatBubble key={i} {...msg} />
        ))}
        {isStreaming && (
          <ChatBubble
            variant="ai"
            senderName={aiName}
            content={streamingText}
            avatarSrc={aiAvatarSrc}
            isLoading={!streamingText}
          />
        )}
      </div>

      {/* Input bar — Figma 1512:3708 */}
      <div className="sticky right-0 bottom-0 left-0 z-10 shrink-0 bg-linear-to-t from-[#F8FAFF] via-[#F8FAFF]/95 to-transparent px-3 pt-4 pb-3">
        {/* Select Options popover — AI 교체 버튼 클릭 시 표시, 입력바 좌측 상단에 위치 */}
        <ChatInputBar
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onEndChat={onEndChat}
          disabled={!isSessionActive || isStreaming}
          onDisabledClick={onDisabledInputClick}
        />
      </div>
    </div>
  );
}
