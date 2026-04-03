import { create } from 'zustand';
import type { EmotionCardData } from './model';
import { getCollectionCardsApi } from './api';

interface CollectionState {
  cards: EmotionCardData[];
  isLoading: boolean;
  fetched: boolean;
  fetchCards: () => Promise<void>;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  cards: [],
  isLoading: false,
  fetched: false,

  fetchCards: async () => {
    if (get().fetched || get().isLoading) return;
    set({ isLoading: true });
    try {
      const cards = await getCollectionCardsApi();
      set({ cards, fetched: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));
