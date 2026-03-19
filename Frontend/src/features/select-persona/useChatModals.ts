'use client';

import { useState } from 'react';
import type { ChatModalType } from '@/app/(main)/chat/page';

export const useChatModals = () => {
  const [activeModal, setActiveModal] = useState<ChatModalType>(null);

  const openModal = (type: ChatModalType) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return { activeModal, openModal, closeModal };
};
