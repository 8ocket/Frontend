'use client';

import { useState } from 'react';

import { ChatMainArea, ChatSidebar } from '@/components/chat';

type ModalState = 'resume' | 'end' | 'credit' | 'newChat' | null;

export default function ChatPage() {
  const [modal, setModal] = useState<ModalState>(null);

  return (
    // GNB는 layout.tsx에서 전역 렌더링 — 여기서는 콘텐츠 영역만
    // 1920px 기준: 좌우 240px 패딩, gap 43px, 하단 116px
    <div className="flex h-[calc(100vh-80px)] gap-10.75 overflow-hidden px-60">
      <ChatSidebar onNewChat={() => setModal('resume')} />
      <ChatMainArea modal={modal} onModalChange={setModal} />
    </div>
  );
}
