'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import { Search } from 'lucide-react';

import { ChatFilterPanel } from './ChatFilterPanel';
import { ChatScrollbar } from './ChatScrollbar';
import { ChatSessionGroup, ChatSessionList } from './ChatSessionList';

export interface ChatSidebarProps {
  /** 새 상담 시작 버튼 클릭 시 호출 (페르소나 선택 모달 열기) */
  onNewCounsel?: () => void;
}

const PAGE_SIZE = 5;

// Figma 1379:2840 샘플 데이터
const ALL_SESSION_GROUPS: ChatSessionGroup[] = [
  {
    date: '2026년 2월 17일',
    sessions: [
      { id: '1', title: '설날 기간 친척들과의 불편한 이야기', isActive: true, avatarSrc: '/images/personas/mental.png' },
      { id: '2', title: '잘 나가는 사촌과 비교 당하지 않기', avatarSrc: '/images/personas/coaching.png' },
    ],
  },
  {
    date: '2026년 2월 16일',
    sessions: [
      { id: '3', title: '명절기간 본가에 내려가야 하나', avatarSrc: '/images/personas/career.png' },
      { id: '4', title: '명절 기간 동안  스펙쌓기', avatarSrc: '/images/personas/mental.png' },
    ],
  },
  {
    date: '2026년 2월 15일',
    sessions: [{ id: '5', title: '면접 떨리고 긴장하는 현상 대비', avatarSrc: '/images/personas/career.png' }],
  },
  {
    date: '2026년 2월 14일',
    sessions: [
      { id: '6', title: '팀 스터디 효율적인 진행 방식', avatarSrc: '/images/personas/coaching.png' },
      { id: '7', title: '삼성전자 직군별 갖춰야 할 스펙', avatarSrc: '/images/personas/career.png' },
    ],
  },
  {
    date: '2026년 2월 13일',
    sessions: [
      { id: '8', title: '면접 볼 때 면접관에게 하기 좋은 질문', avatarSrc: '/images/personas/mental.png' },
      { id: '9', title: '삼성전자 직군별 갖춰야 할 스펙', avatarSrc: '/images/personas/coaching.png' },
    ],
  },
  {
    date: '2026년 2월 12일',
    sessions: [
      { id: '10', title: '직장 동료와의 갈등 해소 방법', avatarSrc: '/images/personas/mental.png' },
      { id: '11', title: '번아웃 극복하기', avatarSrc: '/images/personas/coaching.png' },
    ],
  },
  {
    date: '2026년 2월 11일',
    sessions: [{ id: '12', title: '대인관계 스트레스 줄이기', avatarSrc: '/images/personas/career.png' }],
  },
];

export function ChatSidebar({ onNewCounsel }: ChatSidebarProps = {}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.2);
  const [visibleCount, setVisibleCount] = useState(ALL_SESSION_GROUPS.length);

  const visibleGroups = ALL_SESSION_GROUPS.slice(0, visibleCount);
  const hasMore = visibleCount < ALL_SESSION_GROUPS.length;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    setScrollRatio(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
    setThumbRatio(el.clientHeight / el.scrollHeight);

    // 스크롤이 하단에 가까워지면 추가 로드
    if (hasMore && el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, ALL_SESSION_GROUPS.length));
    }
  }, [hasMore]);

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
    <aside className="relative flex h-[calc(100dvh-4rem)] w-full shrink-0 flex-col gap-4 bg-transparent px-4 md:h-[calc(100dvh-5rem)] lg:w-80.75 lg:px-0">
      {/* Logo — Figma 1361:2679 */}
      <div className="flex h-10.5 w-36 items-center justify-center">
        <span
          className="text-prime-900"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '-0.48px',
            lineHeight: '130%',
          }}
        >
          마인드 로그
        </span>
      </div>

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
