'use client';

import { useState, useRef, useCallback } from 'react';

import { Search } from 'lucide-react';

import { ChatFilterPanel } from './ChatFilterPanel';
import { ChatLoadMoreButton } from './ChatLoadMoreButton';
import { ChatScrollbar } from './ChatScrollbar';
import { ChatSessionGroup, ChatSessionList } from './ChatSessionList';

export interface ChatSidebarProps {
  /** 새 상담 시작 버튼 클릭 시 호출 (페르소나 선택 모달 열기) */
  onNewCounsel?: () => void;
}

// Figma 1379:2840 샘플 데이터
const MOCK_SESSION_GROUPS: ChatSessionGroup[] = [
  {
    date: '2026년 2월 17일',
    sessions: [
      { id: '1', title: '설날 기간 친척들과의 불편한 이야기', isActive: true },
      { id: '2', title: '잘 나가는 사촌과 비교 당하지 않기' },
    ],
  },
  {
    date: '2026년 2월 16일',
    sessions: [
      { id: '3', title: '명절기간 본가에 내려가야 하나' },
      { id: '4', title: '명절 기간 동안  스펙쌓기' },
    ],
  },
  {
    date: '2026년 2월 15일',
    sessions: [{ id: '5', title: '면접 떨리고 긴장하는 현상 대비' }],
  },
  {
    date: '2026년 2월 14일',
    sessions: [
      { id: '6', title: '팀 스터디 효율적인 진행 방식' },
      { id: '7', title: '삼성전자 직군별 갖춰야 할 스펙' },
    ],
  },
  {
    date: '2026년 2월 13일',
    sessions: [
      { id: '8', title: '면접 볼 때 면접관에게 하기 좋은 질문' },
      { id: '9', title: '삼성전자 직군별 갖춰야 할 스펙' },
    ],
  },
];

export function ChatSidebar({ onNewCounsel }: ChatSidebarProps = {}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.2);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    setScrollRatio(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
    setThumbRatio(el.clientHeight / el.scrollHeight);
  }, []);

  const handleScrollTo = useCallback((ratio: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  }, []);

  return (
    <aside className="flex w-80.75 shrink-0 flex-col gap-4 bg-transparent">
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

      {/* Search Input — Figma 1361:2666 */}
      <div
        className="border-neutral-300 bg-secondary-100 flex h-11 w-80 items-center justify-between rounded-lg border px-4 py-3"
        style={{ gap: '212px' }}
      >
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

      {/* 새 상담 버튼 — Figma 사이드바 상단 */}
      <button
        type="button"
        onClick={onNewCounsel}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-cta-300 text-base font-medium leading-none text-prime-900 transition-colors hover:bg-[#4ba1f0] active:bg-[#257cc0]"
      >
        상담
      </button>

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
          className="bg-success-700 flex items-center justify-center rounded-lg px-2"
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

      {/* Filter Panel — Figma 1512:3168 (토글) */}
      {filterOpen && (
        <ChatFilterPanel
          onClose={() => setFilterOpen(false)}
          onApply={() => setFilterOpen(false)}
        />
      )}

      {/* Chat Session List + 커스텀 스크롤바 — Figma 1379:2840, 1457:2423 */}
      <div className="relative flex flex-1 flex-row overflow-hidden">
        <ChatSessionList
          groups={MOCK_SESSION_GROUPS}
          scrollRef={scrollRef}
          onScroll={handleScroll}
        />
        <ChatScrollbar
          scrollRatio={scrollRatio}
          thumbRatio={thumbRatio}
          onScrollTo={handleScrollTo}
        />
      </div>

      {/* 더 보기 버튼 — Figma 1363:2961, 세션 리스트(315px) 중앙 정렬 */}
      <div className="flex w-78.75 justify-center">
        <ChatLoadMoreButton />
      </div>
    </aside>
  );
}
