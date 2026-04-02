import { User, AuthResponse } from '@/entities/user';
import {
  RefreshTokenResponse,
  KakaoLoginResponse,
  GoogleLoginResponse,
  UserProfileResponse,
  UpdateMyProfileResponse,
} from '@/entities/user/model';

export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 1,
    email: 'test@mindlog.com',
    password: 'password123',
    name: '테스트 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    creditBalance: 0,
  },
  {
    id: 2,
    email: 'demo@mindlog.com',
    password: 'demo123',
    name: '데모 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    creditBalance: 0,
  },
  {
    id: 3,
    email: 'user@mindlog.com',
    password: 'user123',
    name: '일반 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    creditBalance: 0,
  },
];

/** GET /v1/auth/kakao/callback */
export const mockKakaoLogin = (): KakaoLoginResponse => ({
  accessToken: `mock_access_token_${Date.now()}`,
  refreshToken: `mock_refresh_token_${Date.now()}`,
  isNewUser: true,
});

/** GET /v1/auth/google/callback */
export const mockGoogleLogin = (): GoogleLoginResponse => ({
  accessToken: `mock_access_token_${Date.now()}`,
  refreshToken: `mock_refresh_token_${Date.now()}`,
  isNewUser: true,
});

/** GET /v1/auth/refresh */
export const mockRefreshToken = (): RefreshTokenResponse => ({
  access_token: `mock_access_token_${Date.now()}`,
  refresh_token: `mock_refresh_token_${Date.now()}`,
  is_new_user: null,
});

/** GET /v1/users/me/profile */
export const mockGetMyProfile = (): UserProfileResponse => ({
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  nickname: '테스트 사용자',
  nickname_change_count: 0,
});

/** PATCH /v1/users/me/profile */
export const mockUpdateMyProfile = (
  nickName?: string,
  profileImage?: File
): UpdateMyProfileResponse => ({
  user_id: '1',
  profile_image_url: profileImage
    ? URL.createObjectURL(profileImage)
    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  nickname: nickName || '테스트 사용자',
  updated_at: new Date().toISOString(),
});

export const generateMockTokens = (userId: number) => {
  const timestamp = Date.now();
  return {
    accessToken: `mock_access_token_${userId}_${timestamp}`,
    refreshToken: `mock_refresh_token_${userId}_${timestamp}`,
  };
};

export const mockLogin = (email: string, password: string): AuthResponse | null => {
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return {
    ...generateMockTokens(user.id),
    user: userWithoutPassword,
  };
};
