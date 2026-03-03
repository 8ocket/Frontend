// Mock 데이터
// 개발 및 테스트용 mock 데이터를 여기서 export합니다.

import { User, AuthResponse } from '@/types/auth';

/**
 * Mock 사용자 데이터
 */
export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 1,
    email: 'test@mindlog.com',
    password: 'password123',
    name: '테스트 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  },
  {
    id: 2,
    email: 'demo@mindlog.com',
    password: 'demo123',
    name: '데모 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  },
  {
    id: 3,
    email: 'user@mindlog.com',
    password: 'user123',
    name: '일반 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  },
];

/**
 * Mock 토큰 생성
 */
export const generateMockTokens = (userId: number) => {
  const timestamp = Date.now();
  const accessToken = `mock_access_token_${userId}_${timestamp}`;
  const refreshToken = `mock_refresh_token_${userId}_${timestamp}`;
  return { accessToken, refreshToken };
};

/**
 * Mock 로그인 함수
 * 실제 환경에서는 API 요청으로 대체
 */
export const mockLogin = (email: string, password: string): AuthResponse | null => {
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return null;
  }

  const { accessToken, refreshToken } = generateMockTokens(user.id);

  const { password: _, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};
