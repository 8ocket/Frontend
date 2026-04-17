'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import { ChatBubble, ChatBubbleProps } from './ChatBubble';
import { ChatScrollbar } from './ChatScrollbar';
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
  /** 세션 생성 완료 시 호출 — 페이지에서 activeSessionId 업데이트 용도 */
  onSessionCreated?: (sessionId: string) => void;
  /** AI 상담사 표시 이름 */
  aiName?: string;
  /** AI 상담사 아바타 이미지 URL */
  aiAvatarSrc?: string;
  /** 사용자가 메시지를 전송할 때 호출 — 60분 자동 종료 타이머 리셋용 */
  onUserMessage?: () => void;
  /** 사용자 닉네임 */
  userName?: string;
  /** 사용자 프로필 이미지 URL */
  userAvatarSrc?: string;
}

export function ChatMainArea({
  onEndChat,
  onCreditShortage,
  onUnfinishedSession: _onUnfinishedSession,
  initialMessages = [],
  isSessionActive = true,
  onDisabledInputClick,
  appendMessage,
  sessionId,
  onSessionCreated,
  aiName = '나봄이',
  aiAvatarSrc = '/images/personas/nabomi-44.png',
  onUserMessage,
  userName = '나',
  userAvatarSrc,
}: ChatMainAreaProps = {}) {
  const [messages, setMessages] = useState<ChatBubbleProps[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevSessionIdRef = useRef<string | undefined>(sessionId);
  // handleSend에서 세션을 직접 생성한 경우 true → sessionId 변경 시 메시지 유지
  const justCreatedSessionRef = useRef(false);
  // 항상 최신 initialMessages를 참조하기 위한 ref
  const initialMessagesRef = useRef(initialMessages);
  initialMessagesRef.current = initialMessages;
  const prevAppendMessageRef = useRef<ChatBubbleProps | null | undefined>(null);

  // 세션 전환 시 메시지 교체 (sessionId 기준으로 판단)
  useEffect(() => {
    const prevId = prevSessionIdRef.current;
    prevSessionIdRef.current = sessionId;

    if (prevId === sessionId) return;

    if (sessionId === undefined) {
      // 새 세션 시작 준비 → 메시지 및 스트리밍 상태 초기화
      setMessages([]);
      setIsStreaming(false);
      setStreamingText('');
      return;
    }

    if (justCreatedSessionRef.current) {
      // 방금 이 컴포넌트에서 세션을 생성한 경우 → 기존 메시지 유지
      justCreatedSessionRef.current = false;
      return;
    }

    // 이어가기 / 사이드바 세션 선택 → initialMessages 로드
    setMessages(initialMessagesRef.current);
  }, [sessionId]);

  // 외부에서 메시지 추가 (예: 종료 시 "마음 기록 제작 중")
  // emotionCardData 참조가 같으면 같은 카드의 업데이트(예: cardImageUrl 추가)로 간주해 마지막 메시지를 교체
  useEffect(() => {
    if (!appendMessage) return;
    const prev = prevAppendMessageRef.current;
    const isSameCard =
      prev?.emotionCardData != null &&
      prev.emotionCardData === appendMessage.emotionCardData;
    setMessages((msgs) =>
      isSameCard ? [...msgs.slice(0, -1), appendMessage] : [...msgs, appendMessage]
    );
    prevAppendMessageRef.current = appendMessage;
  }, [appendMessage]);

  // 스크롤 위치 추적 → scrollRatio 업데이트
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      setScrollRatio(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // 메시지/스트리밍 변경 시 thumbRatio 재계산 + 스크롤 하단으로
  // 스크롤은 즉시 처리(scroll event → scrollRatio 동기 업데이트),
  // thumbRatio는 rAF로 지연해 EmotionCard 등 레이아웃 완료 후 측정
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    const raf = requestAnimationFrame(() => {
      setThumbRatio(el.clientHeight / el.scrollHeight);
    });
    return () => cancelAnimationFrame(raf);
  }, [messages, streamingText]);

  const handleScrollTo = useCallback((ratio: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  }, []);

  async function handleSend() {
    if (!inputValue.trim() || isStreaming) return;

    const content = inputValue.trim();
    setInputValue('');
    onUserMessage?.();

    setMessages((prev) => [...prev, { variant: 'user', senderName: userName, userAvatarSrc, content }]);

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
        const code = err instanceof Error ? err.message : '';
        if (code === 'INSUFFICIENT_CREDIT') {
          onCreditShortage?.();
        } else {
          console.warn('Session create error:', code || err);
        }
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
        },
        (errorMessage) => {
          console.error('SSE error:', errorMessage);
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

      {/* Message scroll area + custom scrollbar */}
      <div className="relative flex min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="relative flex flex-1 flex-col gap-4 overflow-y-auto p-6 pb-2"
          style={{ scrollbarWidth: 'none' }}
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
        {thumbRatio < 1 && (
          <div className="flex pt-6">
            <ChatScrollbar
              scrollRatio={scrollRatio}
              thumbRatio={thumbRatio}
              onScrollTo={handleScrollTo}
            />
          </div>
        )}
      </div>

      {/* Input bar — Figma 1512:3708 */}
      <div className="sticky right-0 bottom-0 left-0 z-10 shrink-0 bg-linear-to-t from-[#F8FAFF] via-[#F8FAFF]/95 to-transparent px-3 pt-2 pb-3">
        <p className="mb-2 text-center text-[10px] leading-snug text-prime-400/50">
          본 기록은 비공개 보안 저장소에 암호화되어 저장되었으며 본인 외에는 관리자도 열람하지 못합니다.
        </p>
        <ChatInputBar
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onEndChat={onEndChat}
          disabled={!isSessionActive || isStreaming}
          onDisabledClick={!isSessionActive ? onDisabledInputClick : undefined}
        />
      </div>
    </div>
  );
}
