import { create } from 'zustand';

export type GnbTheme = 'light' | 'dark';

interface GnbStore {
  theme: GnbTheme;
  setTheme: (theme: GnbTheme) => void;
}

export const useGnbStore = create<GnbStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
