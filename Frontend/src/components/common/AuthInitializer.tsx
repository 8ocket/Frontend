'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { getCookie } from '@/shared/lib/utils/cookie';

export function AuthInitializer() {
  useEffect(() => {
    const token = getCookie('accessToken');
    if (!token) {
      useAuthStore.getState().logout();
    }
  }, []);

  return null;
}
