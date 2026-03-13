import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCookie, deleteCookie } from '@/lib/utils/cookie';

interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: (user, accessToken, refreshToken) => {
        setCookie('accessToken', accessToken, 60 * 60); // 1시간
        if (refreshToken) {
          setCookie('refreshToken', refreshToken, 30 * 24 * 60 * 60); // 30일
        }
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
