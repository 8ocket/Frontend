import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CreditState {
  totalCredit: number;
  paidCredit: number;
  freeCredit: number;
  setTotalCredit: (amount: number) => void;
  setPaidCredit: (amount: number) => void;
  setFreeCredit: (amount: number) => void;
  addPaidCredit: (amount: number) => void;
  addFreeCredit: (amount: number) => void;
  usePaidCredit: (amount: number) => void;
  useFreeCredit: (amount: number) => void;
  resetCredits: () => void;
}

export const useCreditStore = create<CreditState>()(
  persist(
    (set) => ({
      totalCredit: 0,
      paidCredit: 0,
      freeCredit: 0,

      setTotalCredit: (amount) => set({ totalCredit: amount }),
      setPaidCredit: (amount) => set({ paidCredit: amount }),
      setFreeCredit: (amount) => set({ freeCredit: amount }),
      addPaidCredit: (amount) => set((state) => ({ paidCredit: state.paidCredit + amount })),
      addFreeCredit: (amount) => set((state) => ({ freeCredit: state.freeCredit + amount })),
      usePaidCredit: (amount) =>
        set((state) => ({ paidCredit: Math.max(0, state.paidCredit - amount) })),
      useFreeCredit: (amount) =>
        set((state) => ({ freeCredit: Math.max(0, state.freeCredit - amount) })),
      resetCredits: () => set({ totalCredit: 0, paidCredit: 0, freeCredit: 0 }),
    }),
    {
      name: 'credit-storage',
    }
  )
);
