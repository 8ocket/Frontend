'use client';

import { MoreHorizontal } from 'lucide-react';

export type ChatSession = {
  id: string;
  title: string;
  avatarSrc?: string;
  isActive?: boolean;
};

export type ChatSessionGroup = {
  date: string;
  sessions: ChatSession[];
};

type ChatSessionItemProps = {
  session: ChatSession;
  isActive?: boolean;
  onSelect?: (id: string) => void;
};

function ChatSessionItem({ session, isActive, onSelect }: ChatSessionItemProps) {
  return (
    <div
      onClick={() => onSelect?.(session.id)}
      className={[
        'relative flex h-11 w-full shrink-0 cursor-pointer flex-row items-center overflow-hidden rounded-lg transition-colors',
        isActive
          ? 'bg-(--main-blue)/10'
          : 'hover:bg-prime-100/60',
      ].join(' ')}
    >
      {/* 선택 인디케이터 */}
      {isActive && (
        <div
          className="absolute left-0 top-0 h-full w-0.5 rounded-r-sm"
          style={{ background: 'var(--main-blue)', width: '2px' }}
        />
      )}

      {/* AI Persona Profile Photo */}
      <div className="ml-3 flex h-5.25 w-5.25 shrink-0 items-center justify-center overflow-hidden rounded-full">
        {session.avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.avatarSrc}
            alt="AI 페르소나"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="bg-secondary-300 h-full w-full rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center overflow-hidden px-2">
        <span
          className={[
            'overflow-hidden text-ellipsis whitespace-nowrap text-sm',
            isActive ? 'font-semibold' : 'font-medium text-prime-700',
          ].join(' ')}
          style={isActive ? { color: 'var(--main-blue)', fontFamily: 'var(--font-pretendard)' } : { fontFamily: 'var(--font-pretendard)' }}
        >
          {session.title}
        </span>
      </div>

      {/* Options (3-dot menu) */}
      <div className="flex h-10 w-9 shrink-0 items-center justify-center">
        <MoreHorizontal
          className="text-prime-400"
          size={18}
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

type ChatSessionListProps = {
  groups: ChatSessionGroup[];
  activeSessionId?: string;
  onSelectSession?: (id: string) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
};

export function ChatSessionList({ groups, activeSessionId, onSelectSession, scrollRef, onScroll }: ChatSessionListProps) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex h-full w-full flex-col gap-4 overflow-x-hidden overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      {groups.map((group, idx) => (
        <div key={group.date} className="flex flex-col gap-1">
          {/* Date Label */}
          <div className={['flex items-center gap-2', idx > 0 ? 'mt-3' : ''].join(' ')}>
            <div className="h-px flex-1 bg-slate-100" />
            <span
              className="shrink-0 text-[10px] font-medium tracking-wide text-slate-300"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              {group.date}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Chat Session Items */}
          {group.sessions.map((session) => (
            <ChatSessionItem
              key={session.id}
              session={session}
              isActive={session.id === activeSessionId}
              onSelect={onSelectSession}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
