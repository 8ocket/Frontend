'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import { Search } from 'lucide-react';

import { ChatFilterPanel } from './ChatFilterPanel';
import { ChatScrollbar } from './ChatScrollbar';
import { type ChatSessionGroup, ChatSessionList } from './ChatSessionList';

export interface ChatSidebarProps {
  /** 새 상담 시작 버튼 클릭 시 호출 (페르소나 선택 모달 열기) */
  onNewCounsel?: () => void;
  activeSessionId?: string;
  onSelectSession?: (id: string) => void;
  sessionGroups?: ChatSessionGroup[];
}

const PAGE_SIZE = 5;

export function ChatSidebar({ onNewCounsel, activeSessionId, onSelectSession, sessionGroups = [] }: ChatSidebarProps = {}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.2);
  const [visibleCount, setVisibleCount] = useState(sessionGroups.length);

  const visibleGroups = sessionGroups.slice(0, visibleCount);
  const hasMore = visibleCount < sessionGroups.length;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    setScrollRatio(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
    setThumbRatio(el.clientHeight / el.scrollHeight);

    // 스크롤이 하단에 가까워지면 추가 로드
    if (hasMore && el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sessionGroups.length));
    }
  }, [hasMore, sessionGroups.length]);

  const handleScrollTo = useCallback((ratio: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  }, []);

  // thumbRatio 재계산 (초기 렌더 + 데이터 추가 시)
  // rAF로 지연하여 flex 레이아웃이 완전히 확정된 뒤 계산
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      setThumbRatio(el.clientHeight / el.scrollHeight);
    });
    return () => cancelAnimationFrame(raf);
  }, [visibleCount]);

  return (
    <aside className="relative flex h-[calc(100dvh-4rem)] w-full shrink-0 flex-col gap-4 bg-transparent px-4 pt-4 md:h-[calc(100dvh-5rem)] md:pt-6 lg:w-80.75 lg:px-0">
      {/* 새로운 상담 버튼 — Figma 340:19 */}
      <button
        type="button"
        onClick={onNewCounsel}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg transition-colors hover:bg-[#4BA1F0] active:bg-[#257CC0]"
        style={{
          padding: '14px 24px',
          background: '#82C9FF',
          fontFamily: 'var(--font-pretendard)',
          fontSize: '16px',
          fontWeight: 500,
          color: '#1A222E',
          lineHeight: '100%',
        }}
      >
        새로운 상담
      </button>

      {/* Search Input — Figma 1361:2666 */}
      <div className="bg-secondary-100 flex h-11 w-full items-center justify-between rounded-lg border border-neutral-300 px-4 py-3 lg:w-80">
        <span
          className="text-prime-900 shrink-0"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '160%',
          }}
        >
          Search
        </span>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center p-1.25">
          <Search className="text-prime-900" size={22} strokeWidth={1.5} />
        </div>
      </div>

      {/* 최근 항목 + 필터 옵션 — Figma 1457:2758 */}
      <div className="flex w-full items-center justify-between">
        <span
          className="text-tertiary-400"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '-0.21px',
            lineHeight: '130%',
          }}
        >
          최근 항목
        </span>
        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          className="bg-success-700 flex items-center justify-center rounded-lg px-2 transition-colors hover:bg-[#0C8A60] active:bg-[#085B40]"
          style={{ height: '18px' }}
        >
          <span
            className="text-inverse"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '-0.21px',
              lineHeight: '130%',
            }}
          >
            필터 옵션
          </span>
        </button>
      </div>

      {/* Filter Panel — absolute 오버레이, 목록 위에 떠있음 */}
      {filterOpen && (
        <div className="absolute top-53 left-0 z-10 w-full">
          <ChatFilterPanel
            onClose={() => setFilterOpen(false)}
            onApply={() => setFilterOpen(false)}
          />
        </div>
      )}

      {/* Chat Session List + 커스텀 스크롤바 — Figma 1379:2840, 1457:2423 */}
      <div className="relative flex flex-1 flex-row overflow-hidden min-h-0">
        <ChatSessionList
          groups={visibleGroups}
          activeSessionId={activeSessionId}
          onSelectSession={onSelectSession}
          scrollRef={scrollRef}
          onScroll={handleScroll}
        />
        {thumbRatio < 1 && (
          <ChatScrollbar
            scrollRatio={scrollRatio}
            thumbRatio={thumbRatio}
            onScrollTo={handleScrollTo}
          />
        )}
      </div>
    </aside>
  );
}
