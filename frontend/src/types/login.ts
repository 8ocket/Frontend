export type LoginProvider = 'kakao' | 'naver' | 'google';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    provider: LoginProvider;
  };
}

export interface LoginError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

/**
 * Kakao OAuth 로그인 응답
 * POST /v1/auth/login/kakao 에서 반환
 */
export interface KakaoLoginResponse extends LoginResponse {
  user: LoginResponse['user'] & {
    provider: 'kakao';
  };
}
