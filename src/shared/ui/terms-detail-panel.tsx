'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

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
  isAgreed = false,
  className,
}: TermsDetailPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(80);
  const [trackHeight, setTrackHeight] = useState(0);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) {
      setScrollRatio(0);
      setThumbHeight(0);
      setIsScrolledToBottom(true);
      return;
    }

    const ratio = scrollTop / maxScroll;
    setScrollRatio(ratio);

    const visibleRatio = clientHeight / scrollHeight;
    setThumbHeight(Math.max(40, visibleRatio * clientHeight));

    setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 2);

    if (trackRef.current) {
      setTrackHeight(trackRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 초기 스크롤 상태를 requestAnimationFrame으로 지연 계산
    const raf = requestAnimationFrame(() => updateScroll());
    el.addEventListener('scroll', updateScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', updateScroll);
    };
  }, [updateScroll]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const ratio = clickY / trackHeight;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  };

  const canAgree = isScrolledToBottom || isAgreed;
  const thumbTop = scrollRatio * (trackHeight - thumbHeight);

  return (
    <div
      className={cn(
        'relative flex size-full flex-col gap-2.5 overflow-hidden rounded-xl p-6',
        'bg-[rgba(248,250,252,0.3)] backdrop-blur-[20px]',
        className
      )}
    >
      {/* 헤더: 제목 + 닫기 */}
      <div className="relative flex h-11 shrink-0 items-center">
        <h2 className="text-cta-400 absolute top-px left-0 text-[32px] leading-[1.3] font-semibold tracking-[-0.48px] whitespace-nowrap">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-cta-400 absolute -top-px right-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5"
          aria-label="닫기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 본문: 스크롤 영역 + 커스텀 스크롤바 */}
      <div className="flex max-h-122.5 gap-2.5 overflow-hidden">
        {/* 스크롤 콘텐츠 */}
        <div
          ref={scrollRef}
          className="scrollbar-none min-w-0 flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="text-prime-700 text-sm leading-[1.6] font-normal">{children}</div>
        </div>

        {/* 커스텀 스크롤바 트랙 */}
        {thumbHeight > 0 && (
          <div
            ref={trackRef}
            className="w-4 shrink-0 cursor-pointer overflow-hidden rounded-full bg-[rgba(130,201,255,0.1)]"
            onClick={handleTrackClick}
          >
            <div
              className="w-4 rounded-full bg-[rgba(130,201,255,0.3)] transition-[top] duration-75"
              style={{
                height: `${thumbHeight}px`,
                transform: `translateY(${thumbTop}px)`,
              }}
            />
          </div>
        )}
      </div>

      {/* 동의/미동의 버튼 */}
      {onDisagree ? (
        <div className="absolute bottom-4 left-1/2 flex w-89.75 -translate-x-1/2 gap-2">
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
            'absolute bottom-4 left-1/2 h-11 w-89.75 -translate-x-1/2 rounded-full text-base leading-[1.3] font-medium transition-colors',
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
