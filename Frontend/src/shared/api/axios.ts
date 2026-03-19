import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from '@/shared/lib/utils/cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 - 쿠키에서 토큰 읽어 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터 - 401 시 토큰 갱신 후 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.get(`${API_BASE_URL}/auth/refresh`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = data.data?.accessToken;
        if (!newAccessToken) throw new Error('No access token in response');

        setCookie('accessToken', newAccessToken, 60 * 60);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
