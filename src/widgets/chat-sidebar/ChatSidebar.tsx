'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import { Search, PlusCircle } from 'lucide-react';

import { DeleteSessionModal } from './DeleteSessionModal';
import { ChatFilterPanel } from './ChatFilterPanel';
import { ChatScrollbar } from './ChatScrollbar';
import { type ChatSessionGroup, ChatSessionList } from './ChatSessionList';

export interface ChatSidebarProps {
  /** 새 상담 시작 버튼 클릭 시 호출 (페르소나 선택 모달 열기) */
  onNewCounsel?: () => void;
  activeSessionId?: string;
  onSelectSession?: (id: string) => void;
  onDeleteSession?: (id: string) => void;
  sessionGroups?: ChatSessionGroup[];
}

const PAGE_SIZE = 5;

export function ChatSidebar({ onNewCounsel, activeSessionId, onSelectSession, onDeleteSession, sessionGroups = [] }: ChatSidebarProps = {}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        filterOpen &&
        filterRef.current && !filterRef.current.contains(e.target as Node) &&
        filterBtnRef.current && !filterBtnRef.current.contains(e.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.2);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // sessionGroups가 비동기로 로드될 때 visibleCount 동기화
  useEffect(() => {
    setVisibleCount((prev) => Math.max(prev, sessionGroups.length));
  }, [sessionGroups.length]);

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
    <aside className="relative flex w-full shrink-0 flex-col bg-white lg:w-80.75 lg:border-r lg:border-prime-100" style={{ height: 'calc(100dvh - var(--gnb-height))' }}>
      {/* 헤더 영역 */}
      <div className="border-b border-prime-100 px-5 py-4">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-prime-400">
          Consultation History
        </p>

        {/* 새로운 상담 버튼 */}
        <button
          type="button"
          onClick={onNewCounsel}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-prime-200 py-2.5 text-sm font-semibold text-prime-500 transition-all hover:border-main-blue hover:text-main-blue active:opacity-80"
          style={{ fontFamily: 'var(--font-pretendard)' }}
        >
          <PlusCircle size={16} strokeWidth={2} className="text-main-blue" />
          새로운 상담
        </button>
      </div>

      {/* 검색 + 필터 영역 */}
      <div className="flex items-center gap-2 border-b border-prime-100 px-5 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-prime-100 bg-[#F8FAFF] px-3 py-2">
          <Search className="shrink-0 text-main-blue" size={15} strokeWidth={2} />
          <input
            type="text"
            placeholder="검색"
            className="w-full bg-transparent text-[13px] text-prime-900 outline-none placeholder:text-prime-400"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          />
        </div>
        <button
          ref={filterBtnRef}
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          className="rounded-lg border border-prime-100 bg-[#F8FAFF] px-3 py-2 text-[13px] font-medium text-prime-500 transition-colors hover:border-main-blue hover:text-main-blue"
          style={{ fontFamily: 'var(--font-pretendard)' }}
        >
          필터
        </button>
      </div>

      {/* Filter Panel — 인라인 아코디언 */}
      <div
        ref={filterRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: filterOpen ? '600px' : '0px', opacity: filterOpen ? 1 : 0 }}
      >
        <ChatFilterPanel
          onClose={() => setFilterOpen(false)}
          onApply={() => setFilterOpen(false)}
        />
      </div>

      {/* Chat Session List + 커스텀 스크롤바 */}
      <div className="relative flex min-h-0 flex-1 flex-row overflow-hidden px-3 py-3">
        <ChatSessionList
          groups={visibleGroups}
          activeSessionId={activeSessionId}
          onSelectSession={onSelectSession}
          onDeleteSession={(id) => setSessionToDelete(id)}
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
      {/* 세션 삭제 확인 모달 */}
      <DeleteSessionModal
        isOpen={sessionToDelete !== null}
        onClose={() => setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) onDeleteSession?.(sessionToDelete);
          setSessionToDelete(null);
        }}
      />
    </aside>
  );
}
