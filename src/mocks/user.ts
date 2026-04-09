import { User, AuthResponse } from '@/entities/user';
import {
  RefreshTokenResponse,
  KakaoLoginResponse,
  GoogleLoginResponse,
  UserProfileResponse,
  UpdateMyProfileResponse,
  OccupationType,
  AgeGroup,
  Gender,
} from '@/entities/user/model';

export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    password: 'password123',
    name: '테스트 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    password: 'demo123',
    name: '데모 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    password: 'user123',
    name: '일반 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
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
  age_group: 20,
  occupation: 'STUDENT',
  gender: 'MALE',
});

/** PATCH /v1/users/me/profile */
export const mockUpdateMyProfile = (
  nickName: string,
  profileImage?: File,
  options?: {
    age_group?: AgeGroup | null;
    occupation?: OccupationType | null;
    gender?: Gender | null;
  }
): UpdateMyProfileResponse => ({
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  profile_image_url: profileImage
    ? URL.createObjectURL(profileImage)
    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  nickname: nickName || '테스트 사용자',
  updated_at: new Date().toISOString(),
  age_group: options?.age_group ?? 20,
  occupation: options?.occupation ?? 'STUDENT',
  gender: options?.gender ?? 'MALE',
});

export const generateMockTokens = (userId: string) => {
  const timestamp = Date.now();
  return {
    accessToken: `mock_access_token_${userId}_${timestamp}`,
    refreshToken: `mock_refresh_token_${userId}_${timestamp}`,
  };
};

export const mockLogin = (email: string, password: string): AuthResponse | null => {
  const user = MOCK_USERS.find((u) => u.password === password);
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return {
    ...generateMockTokens(user.id),
    user: userWithoutPassword,
    isNewUser: false,
  };
};
