'use client';

import { ChatMainArea, ChatSidebar } from '@/components/chat';

export default function ChatPage() {
  return (
    // GNB는 layout.tsx에서 전역 렌더링 — 여기서는 콘텐츠 영역만
    // 1920px 기준: 좌우 240px 패딩, gap 43px, 하단 116px
    <div className="flex h-[calc(100vh-80px)] gap-10.75 overflow-hidden px-60 pb-29">
      <ChatSidebar />
      <ChatMainArea />
    </div>
  );
}
