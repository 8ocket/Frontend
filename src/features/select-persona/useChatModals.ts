'use client';

import { useCallback, useState } from 'react';
import type { ChatModalType } from '@/app/(main)/chat/page';

export const useChatModals = () => {
  const [activeModal, setActiveModal] = useState<ChatModalType>(null);

  // Stable callbacks prevent effects that depend on these handlers
  // from re-running on every render and reopening the same modal.
  const openModal = useCallback((type: ChatModalType) => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return { activeModal, openModal, closeModal };
};
