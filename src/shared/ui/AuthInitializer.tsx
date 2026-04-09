'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/entities/user/store';
import { getCookie } from '@/shared/lib/utils/cookie';
import { decodeJwt } from 'jose';

function isTokenValid(token: string): boolean {
  try {
    const { exp } = decodeJwt(token);
    return exp ? exp * 1000 > Date.now() : false;
  } catch {
    return false;
  }
}

export function AuthInitializer() {
  useEffect(() => {
    const { logout, setLoading } = useAuthStore.getState();
    const token = getCookie('accessToken');
    if (!token || !isTokenValid(token)) {
      logout();
    }
    setLoading(false);
  }, []);

  return null;
}
