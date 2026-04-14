import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from '@/shared/lib/utils/cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 토큰 갱신 전용 인스턴스 — 인터셉터 없음
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ENDPOINTS = ['/auth/kakao/callback', '/auth/google/callback', '/auth/login'];

// Request 인터셉터 - 쿠키에서 토큰 읽어 자동 추가
api.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => config.url?.startsWith(endpoint));
    if (!isPublic) {
      const token = getCookie('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // FormData 전송 시 Content-Type을 삭제해 브라우저가 boundary 포함한 헤더를 자동 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터 - 401 에러 시 토큰 갱신 로직 처리

/**
 * 401 에러가 발생하면 refreshApi를 사용해 토큰을 갱신하고, 원래 요청을 새로운 토큰으로 재시도
 * 동시에 여러 요청이 401을 받을 경우, 첫 번째 요청만 토큰 갱신을 시도하고 나머지는 큐에 넣어 대기
 * 토큰 갱신이 완료되면 큐에 있는 요청들을 새로운 토큰으로 재시도
 * 만약 토큰 갱신에 실패하면 큐에 있는 모든 요청을 에러로 처리하고, 사용자에게 로그인 페이지로 리다이렉트
 */
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // 이미 refresh 중이면 큐에 추가하고 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await refreshApi.get('/auth/refresh', {
          params: { refreshToken },
        });

        const newAccessToken = data.accessToken;
        if (!newAccessToken) throw new Error('No access token in response');

        setCookie('accessToken', newAccessToken, 60 * 60);
        if (data.refreshToken) setCookie('refreshToken', data.refreshToken, 30 * 24 * 60 * 60);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
