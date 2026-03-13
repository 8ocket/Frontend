import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { LoginProvider, LoginResponse, LoginError } from '@/types/login';

export function useLogin() {
  return useMutation<LoginResponse, LoginError, LoginProvider>({
    mutationFn: async (provider: LoginProvider) => {
      const response = await api.post<LoginResponse>('/auth/login', {
        provider,
      });
      return response.data;
    },
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}
