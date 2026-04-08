'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/entities/user/store';
import { getCookie } from '@/shared/lib/utils/cookie';

export function AuthInitializer() {
  useEffect(() => {
    const { logout, setLoading } = useAuthStore.getState();
    const token = getCookie('accessToken');
    if (!token) {
      logout();
    }
    setLoading(false);
  }, []);

  return null;
}
