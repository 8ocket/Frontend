'use client';

import { useRef, useCallback } from 'react';

import { X, Send } from 'lucide-react';

type ChatInputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onEndChat?: () => void;
  /** 입력창 비활성화 (세션 없음) */
  disabled?: boolean;
  /** 비활성 상태에서 입력창/전송 버튼 클릭 시 호출 */
  onDisabledClick?: () => void;
};

export function ChatInputBar({
  value,
  onChange,
  onSend,
  onEndChat,
  disabled = false,
  onDisabledClick,
}: ChatInputBarProps) {
  const canSend = !disabled && value.trim().length > 0;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      onChange(el.value);
    },
    [onChange]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend();
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
      }
    }
  }

  function handleSendClick() {
    if (canSend) {
      onSend();
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }

  return (
    <div className="flex w-full flex-row items-center gap-3 rounded-[24px] border border-blue-50 bg-white px-4 py-3 shadow-lg">
      {/* 상담 종료 버튼 */}
      <button
        type="button"
        onClick={onEndChat}
        disabled={disabled}
        className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-colors hover:bg-red-50 active:bg-red-100 disabled:opacity-40"
      >
        <X
          size={16}
          strokeWidth={2}
          className="text-slate-400 transition-colors group-hover:text-red-400 group-active:text-red-500"
        />
      </button>

      {/* 텍스트 입력 영역 — disabled 시 클릭하면 onDisabledClick 호출 */}
      <textarea
        ref={textareaRef}
        value={value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onChange={(e) => onChange(e.target.value)}
        onClick={disabled ? onDisabledClick : undefined}
        placeholder={
          disabled ? '새로운 상담을 시작해 주세요.' : '오늘 하루, 어떤 마음이 머물렀나요?'
        }
        rows={1}
        readOnly={disabled}
        className={[
          'text-prime-900 flex-1 resize-none overflow-hidden bg-transparent text-sm leading-relaxed outline-none placeholder:text-slate-400',
          disabled ? 'cursor-pointer' : '',
        ].join(' ')}
        style={{ fontFamily: 'var(--font-pretendard)', minHeight: '24px', maxHeight: '160px' }}
      />

      {/* 전송 버튼 — 듀오톤 */}
      <button
        type="button"
        onClick={disabled ? onDisabledClick : handleSendClick}
        disabled={!disabled && !canSend}
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all',
          canSend
            ? 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200'
            : 'cursor-not-allowed bg-slate-50',
        ].join(' ')}
      >
        <Send size={16} strokeWidth={2} className={canSend ? 'text-main-blue' : 'text-slate-300'} />
      </button>
    </div>
  );
}
