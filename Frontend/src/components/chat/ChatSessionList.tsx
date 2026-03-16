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
};

function ChatSessionItem({ session }: ChatSessionItemProps) {
  return (
    <div
      className={[
        'flex h-11 w-78.75 shrink-0 flex-row items-center rounded-lg',
        session.isActive ? 'bg-cta-300' : 'bg-transparent',
      ].join(' ')}
    >
      {/* AI Persona Profile Photo — 21×21 circle */}
      <div className="flex h-5.25 w-5.25 shrink-0 items-center justify-center overflow-hidden rounded-full">
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

      {/* Content — 254×44, pad 8 all, gap 10 */}
      <div className="flex h-11 w-63.5 shrink-0 flex-row items-center justify-center gap-2.5 p-2">
        <span
          className="text-prime-800 w-59.5 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '130%',
          }}
        >
          {session.title}
        </span>
      </div>

      {/* Options (3-dot menu) — 40×40 */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <MoreHorizontal
          className="text-prime-800"
          size={22}
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

type ChatSessionListProps = {
  groups: ChatSessionGroup[];
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
};

export function ChatSessionList({ groups, scrollRef, onScroll }: ChatSessionListProps) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex w-78.75 flex-col gap-6 overflow-x-hidden overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      {groups.map((group) => (
        <div key={group.date} className="flex flex-col gap-2">
          {/* Date Label — 12px Medium */}
          <span
            className="text-prime-800"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '130%',
            }}
          >
            {group.date}
          </span>

          {/* Chat Session Items */}
          {group.sessions.map((session) => (
            <ChatSessionItem key={session.id} session={session} />
          ))}
        </div>
      ))}
    </div>
  );
}
