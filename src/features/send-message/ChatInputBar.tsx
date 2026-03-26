'use client';

import { useRef, useCallback } from 'react';

import { X, Send } from 'lucide-react';

type ChatInputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onEndChat?: () => void;
};

export function ChatInputBar({ value, onChange, onSend, onEndChat }: ChatInputBarProps) {
  const canSend = value.trim().length > 0;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    onChange(el.value);
  }, [onChange]);

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
        className="group flex shrink-0 flex-col items-center justify-center gap-1.5"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-red-50 group-active:bg-red-100">
          <X size={12} strokeWidth={1} className="text-slate-400 transition-colors group-hover:text-red-400 group-active:text-red-500" />
        </div>
        {/* TODO: 타이포그래피 토큰으로 전환 → 11px는 토큰 미정의, 신규 토큰 추가 필요 */}
        <span
          className="text-slate-400"
          style={{ fontFamily: 'var(--font-pretendard)', fontSize: '11px', fontWeight: 400, lineHeight: '100%' }}
        >
          종료
        </span>
      </button>

      {/* 텍스트 입력 영역 */}
      <textarea
        ref={textareaRef}
        value={value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onChange={(e) => onChange(e.target.value)}
        placeholder="오늘 하루, 어떤 마음이 머물렀나요?"
        rows={1}
        className="text-prime-900 placeholder:text-slate-500 flex-1 resize-none overflow-hidden bg-transparent text-sm leading-relaxed outline-none"
        style={{ fontFamily: 'var(--font-pretendard)', minHeight: '24px', maxHeight: '160px' }}
      />

      {/* 전송 버튼 — 듀오톤 */}
      <button
        type="button"
        onClick={handleSendClick}
        disabled={!canSend}
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all',
          canSend
            ? 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200'
            : 'cursor-not-allowed bg-slate-50',
        ].join(' ')}
      >
        <Send
          size={16}
          strokeWidth={2}
          className={canSend ? 'text-main-blue' : 'text-slate-300'}
        />
      </button>
    </div>
  );
}
