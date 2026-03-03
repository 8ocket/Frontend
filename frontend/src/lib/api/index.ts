// API 함수 모음
// 백엔드 API 호출 함수들을 여기서 export합니다.

import { api } from '@/lib/axios';
import { AuthResponse, ApiResponse } from '@/types/auth';
import { mockLogin } from '@/mocks';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

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

  // 실제 API 요청
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error?.message || '로그인 실패');
  } catch (error: any) {
    throw error;
  }
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

  try {
    const response = await api.post<ApiResponse<AuthResponse>>(`/auth/login/${provider}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error?.message || '소셜 로그인 실패');
  } catch (error: any) {
    throw error;
  }
};
