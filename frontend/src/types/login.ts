export type LoginProvider = 'kakao' | 'naver' | 'google';

// ─── /v1/auth/refresh ───

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  is_new_user: boolean | null;
}

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

// ─── /v1/auth/kakao/callback ───

export interface KakaoLoginRequest {
  code: string;
}

export interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface KakaoLoginError {
  code: 'INVALID_CREDENTIALS';
  message: string;
}
