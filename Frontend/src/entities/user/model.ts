// ─── 프론트엔드 모델 ───

export interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
  creditBalance: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export type LoginProvider = 'kakao' | 'naver' | 'google';

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

export interface GoogleLoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface GoogleLoginError {
  code: 'INVALID_CREDENTIALS';
  message: string;
}

// ─── DB 스키마 ───

export interface Users {
  user_id: string;
  email: string;
  password_hash: string | null;
  nickname: string | null;
  profile_image_url: string | null;
  credit_balance: number | null;
  selected_persona_id: string | null;
  onboarding_data: string | null;
  created_at: Date | null;
  last_login_at: Date | null;
  is_active: boolean | null;
}

export interface UserItems {
  user_item_id: string;
  user_id: string;
  item_id: string;
  is_equipped: boolean | null;
  acquired_at: Date | null;
}
