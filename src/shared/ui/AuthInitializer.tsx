'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/entities/user/store';
import { useCreditStore } from '@/entities/credits/store';
import { getMyCreditApi } from '@/entities/credits/api';
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
    const initializeAuth = async () => {
      const { logout, setLoading } = useAuthStore.getState();
      const token = getCookie('accessToken');

      if (!token || !isTokenValid(token)) {
        logout();
        setLoading(false);
        return;
      }

      try {
        const credit = await getMyCreditApi();
        useCreditStore.getState().setTotalCredit(credit.totalCredit);
      } catch {
        // 크레딧 동기화 실패는 치명적이지 않으므로 인증 상태는 유지합니다.
      }

      setLoading(false);
    };

    void initializeAuth();
  }, []);

  return null;
}
