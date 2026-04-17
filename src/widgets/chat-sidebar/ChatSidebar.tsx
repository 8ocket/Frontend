'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import Link from 'next/link';
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
  const [newCounselHovered, setNewCounselHovered] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        filterOpen &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target as Node)
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

  const visibleGroups = sessionGroups.slice(0, Math.min(visibleCount, sessionGroups.length));
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
  }, [visibleCount, sessionGroups.length]);

  return (
    <aside className="lg:border-prime-100 relative flex h-full w-full shrink-0 flex-col bg-white lg:w-80.75 lg:border-r lg:border-l">
      {/* 헤더 영역 */}
      <div className="border-prime-100 border-b px-5 py-4">
        {/* CONSULTATION HISTORY ↔ 크레딧 안내 뱃지 (새로운 상담 hover 시 전환) */}
        <div className="relative mb-4 flex items-center">
          <p
            className="text-prime-400 text-[11px] font-semibold tracking-widest uppercase transition-opacity duration-200"
            style={{ opacity: newCounselHovered ? 0 : 1 }}
          >
            Consultation History
          </p>
          <div
            className="absolute right-0 transition-opacity duration-200"
            style={{ opacity: newCounselHovered ? 1 : 0 }}
          >
            <div
              className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-main-blue/20 p-2.5 text-center text-xs font-medium leading-[120%] tracking-tight text-prime-900 opacity-50"
            >
              기본 무료 1회 · 추가 상담은 70 크레딧 차감
            </div>
          </div>
        </div>

        {/* 새로운 상담 버튼 */}
        <button
          type="button"
          onClick={onNewCounsel}
          onMouseEnter={() => setNewCounselHovered(true)}
          onMouseLeave={() => setNewCounselHovered(false)}
          onFocus={() => setNewCounselHovered(true)}
          onBlur={() => setNewCounselHovered(false)}
          onTouchStart={() => setNewCounselHovered(true)}
          onTouchEnd={() => setNewCounselHovered(false)}
          className="bg-main-blue text-white flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all hover:bg-main-blue/90"
        >
          <PlusCircle size={16} strokeWidth={2} />
          새로운 상담
        </button>
      </div>

      {/* 검색 + 필터 영역 */}
      <div className="border-prime-100 flex items-center gap-2 border-b px-5 py-3">
        <div className="border-prime-100 flex flex-1 items-center gap-2 rounded-lg border bg-[#F8FAFF] px-3 py-2">
          <Search className="text-main-blue shrink-0" size={15} strokeWidth={2} />
          <input
            type="text"
            placeholder="검색"
            className="text-prime-900 placeholder:text-prime-400 w-full bg-transparent text-[13px] outline-none"
          />
        </div>
        <button
          ref={filterBtnRef}
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          className="border-prime-100 text-prime-500 hover:border-main-blue hover:text-main-blue rounded-lg border bg-[#F8FAFF] px-3 py-2 text-[13px] font-medium transition-colors"
        >
          필터
        </button>
      </div>

      {/* Filter Panel — 인라인 아코디언 */}
      <div
        ref={filterRef}
        className={`transition-all duration-300 ease-in-out ${filterOpen ? 'overflow-visible' : 'overflow-hidden'}`}
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
      {/* 푸터 */}
      <div className="shrink-0 px-5 pb-5 pt-4">
        {/* 구분선 */}
        <div className="border-prime-100 mb-4 border-t" />

        {/* 약관 링크 */}
        <div className="mb-3 flex flex-col gap-1">
          {[
            { label: '개인정보처리방침', href: '/terms/personalInfo' },
            { label: '이용약관', href: '/terms/serviceTerm' },
            { label: 'AI 이용 안내', href: '/terms/aiServiceTerm' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-prime-700/70 hover:text-cta-300 -mx-1 rounded px-1 py-1 text-[11px] font-semibold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 저작권 */}
        <p className="text-prime-700/40 text-[10px] leading-relaxed">
          © 2026 마인드 로그 (MindLog).<br />All rights reserved.
        </p>
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
