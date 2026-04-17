import { create } from 'zustand';

interface ChatNavigationState {
  visitKey: number;
  incrementVisitKey: () => void;
}

export const useChatNavigationStore = create<ChatNavigationState>((set) => ({
  visitKey: 0,
  incrementVisitKey: () => set((s) => ({ visitKey: s.visitKey + 1 })),
}));
