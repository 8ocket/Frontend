'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import { cn } from '@/shared/lib/utils';

export interface TermsDetailPanelProps {
  /** 약관 제목 (예: "만 14세 이상 이용 확인") */
  title: string;
  /** 약관 본문 내용 */
  children: React.ReactNode;
  /** 닫기 버튼 클릭 */
  onClose: () => void;
  /** 동의하기 버튼 클릭 */
  onAgree: () => void;
  /** 동의 안 함 버튼 클릭 (제공 시 두 버튼 표시) */
  onDisagree?: () => void;
  /** 필수 여부 */
  required?: boolean;
  /** 이미 동의 완료 여부 */
  isAgreed?: boolean;
  /** 추가 className */
  className?: string;
}

export function TermsDetailPanel({
  title,
  children,
  onClose,
  onAgree,
  onDisagree,
  required,
  isAgreed = false,
  className,
}: TermsDetailPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setIsScrolledToBottom(true);
      return;
    }
    setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => updateScroll());
    el.addEventListener('scroll', updateScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', updateScroll);
    };
  }, [updateScroll]);

  const canAgree = isScrolledToBottom || isAgreed;

  return (
    <div
      className={cn(
        'flex size-full flex-col gap-2.5 overflow-hidden rounded-xl p-6',
        'bg-[rgba(248,250,252,0.3)] backdrop-blur-[20px]',
        className
      )}
    >
      {/* 헤더: 제목 + 닫기 */}
      <div className="relative flex h-11 shrink-0 items-center">
        <h2 className="text-cta-400 absolute top-px left-0 flex items-baseline gap-2 text-[32px] leading-[1.3] font-semibold tracking-[-0.48px] whitespace-nowrap">
          {title}
          {required !== undefined && (
            <span className={cn(
              'text-base font-medium',
              required ? 'text-error-500' : 'text-warning-500'
            )}>
              {required ? '(필수)' : '(선택)'}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-cta-400 absolute -top-px right-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5"
          aria-label="닫기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 본문: 스크롤 영역 */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="no-scrollbar size-full overflow-y-auto"
        >
          <div className="text-prime-700 text-sm leading-[1.6] font-normal">{children}</div>
        </div>
        {/* 하단 페이드 — 스크롤 가능함을 암시 */}
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[rgba(248,250,252,0.95)] to-transparent transition-opacity duration-300',
            isScrolledToBottom ? 'opacity-0' : 'opacity-100'
          )}
        />
      </div>

      {/* 동의/미동의 버튼 */}
      {onDisagree ? (
        <div className="flex shrink-0 gap-2 pt-1">
          <button
            type="button"
            onClick={onDisagree}
            className="border-cta-400 text-cta-400 h-11 flex-1 rounded-full border bg-transparent text-base leading-[1.3] font-medium transition-colors hover:bg-neutral-100"
          >
            동의 안 함
          </button>
          <button
            type="button"
            onClick={onAgree}
            disabled={!canAgree}
            className={cn(
              'h-11 flex-1 rounded-full text-base leading-[1.3] font-medium transition-colors',
              canAgree
                ? 'bg-cta-400 text-secondary-100 hover:bg-cta-300'
                : 'bg-secondary-100 border border-[#cacaca] text-[#cacaca]'
            )}
          >
            동의하기
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onAgree}
          disabled={!canAgree}
          className={cn(
            'h-11 w-full shrink-0 rounded-full text-base leading-[1.3] font-medium transition-colors',
            canAgree
              ? 'bg-cta-400 text-secondary-100 hover:bg-cta-300'
              : 'bg-secondary-100 border border-[#cacaca] text-[#cacaca]'
          )}
        >
          동의하기
        </button>
      )}
    </div>
  );
}
