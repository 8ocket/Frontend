import { api } from '@/shared/api/axios';
import { AuthResponse, ApiResponse, RefreshTokenResponse, KakaoLoginResponse, GoogleLoginResponse } from '@/entities/user/model';
import {
  mockLogin,
  mockRefreshToken,
  mockKakaoLogin,
  mockGoogleLogin,
} from '@/mocks';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * 토큰 갱신 API
 * GET /v1/auth/refresh
 */
export const refreshTokenApi = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRefreshToken()), 500);
    });
  }

  const response = await api.get<ApiResponse<RefreshTokenResponse>>('/auth/refresh', {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '토큰 갱신 실패');
};

/**
 * 카카오 소셜 로그인 API
 * GET /v1/auth/kakao/callback
 */
export const kakaoLoginApi = async (code: string): Promise<KakaoLoginResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockKakaoLogin()), 500);
    });
  }

  const response = await api.get<KakaoLoginResponse>(`/auth/kakao/callback?code=${code}`);
  return response.data;
};

/**
 * 구글 소셜 로그인 API
 * GET /v1/auth/google/callback
 */
export const googleLoginApi = async (code: string): Promise<GoogleLoginResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGoogleLogin()), 500);
    });
  }

  const response = await api.get<GoogleLoginResponse>(`/auth/google/callback?code=${code}`);
  return response.data;
};

// API 함수 모음
// 백엔드 API 호출 함수들을 여기서 export합니다.

/**
 * 로그인 API
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 */
export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  // Mock 모드 사용
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      // 네트워크 지연 시뮬레이션 (500ms)
      setTimeout(() => {
        const result = mockLogin(email, password);
        if (result) {
          resolve(result);
        } else {
          reject({
            response: {
              status: 401,
              data: {
                code: 'INVALID_CREDENTIALS',
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
              },
            },
          });
        }
      }, 500);
    });
  }

  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '로그인 실패');
};

/**
 * 소셜 로그인 API
 * @param provider - 소셜 로그인 제공자 (google, kakao, etc)
 */
export const socialLoginApi = async (
  provider: 'google' | 'kakao' | 'naver'
): Promise<AuthResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = mockLogin('test@mindlog.com', 'password123');
        if (mockResponse) {
          resolve(mockResponse);
        }
      }, 1000);
    });
  }

  const response = await api.post<ApiResponse<AuthResponse>>(`/auth/login/${provider}`);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '소셜 로그인 실패');
};
