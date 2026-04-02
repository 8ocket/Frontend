// ─── 프론트엔드 모델 ───

export interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
  creditBalance: number;
  createdAt?: string;
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

// --- 기본 프로필 응답 타입
export interface BaseProfileResponse {
  user_id: string;
  profile_image_url?: string;
  nickname: string;
}

// --- /v1/users/me/profile (GET) : 사용자 개인정보 조회
export interface UserProfileResponse extends BaseProfileResponse {
  nickname_change_count: number;
}

// --- /v1/users/me/profile (PATCH) : 프로필 이미지 및 닉네임 수정
export interface UpdateMyProfileResponse extends BaseProfileResponse {
  updated_at: string;
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

// ─── 온보딩 ───
export type OccupationType = 'STUDENT' | 'JOB_SEEKER' | 'EMPLOYEE' | 'CAREER_SWITCHER';
export type AgeGroup = 20 | 30 | 40;
export type Gender = 'MALE' | 'FEMALE';

export const OCCUPATION_MAP: Record<string, OccupationType> = {
  '대학생 / 대학원생': 'STUDENT',
  '취업 준비생': 'JOB_SEEKER',
  직장인: 'EMPLOYEE',
  '이직 준비': 'CAREER_SWITCHER',
};

export const AGE_MAP: Record<string, AgeGroup> = {
  '20대': 20,
  '30대': 30,
  '40대': 40,
};
export const GENDER_MAP: Record<string, Gender> = {
  남성: 'MALE',
  여성: 'FEMALE',
};
