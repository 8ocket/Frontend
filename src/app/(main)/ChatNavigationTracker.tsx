'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useChatNavigationStore } from '@/shared/lib/chatNavigationStore';

/**
 * 레이아웃에 마운트되어 /chat 진입을 감지하고 visitKey를 올린다.
 * ChatPage는 visitKey를 ChatPageContent의 key로 사용해 리마운트를 보장한다.
 */
export function ChatNavigationTracker() {
  const pathname = usePathname();
  const incrementVisitKey = useChatNavigationStore((s) => s.incrementVisitKey);

  useEffect(() => {
    if (pathname.startsWith('/chat')) {
      incrementVisitKey();
    }
  }, [pathname, incrementVisitKey]);

  return null;
}
