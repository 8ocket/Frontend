import { api } from '@/shared/api/axios';
import {
  AuthResponse,
  ApiResponse,
  RefreshTokenResponse,
  KakaoLoginResponse,
  GoogleLoginResponse,
  UserProfileResponse,
  UpdateMyProfileResponse,
  OccupationType,
  AgeGroup,
  Gender,
} from '@/entities/user/model';
import {
  mockLogin,
  mockRefreshToken,
  mockKakaoLogin,
  mockGoogleLogin,
  mockGetMyProfile,
  mockUpdateMyProfile,
} from '@/mocks';
import { USE_MOCK } from '@/shared/lib/env';
import { safeParse } from '@/shared/lib/utils/parse';
import {
  RefreshTokenResponseSchema,
  SocialLoginResponseSchema,
  UserProfileResponseSchema,
  UpdateMyProfileResponseSchema,
} from './schema';

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
    params: { refreshToken },
  });

  if (response.data.success && response.data.data) {
    return safeParse(RefreshTokenResponseSchema, response.data.data);
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
  return safeParse(SocialLoginResponseSchema, response.data);
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
  return safeParse(SocialLoginResponseSchema, response.data);
};

/**
 * 내 프로필 조회 Api
 * GET /v1/users/me/profile
 */
export const getMyProfileApi = async (): Promise<UserProfileResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGetMyProfile()), 500);
    });
  }

  const response = await api.get<UserProfileResponse>('/users/me/profile');
  return safeParse(UserProfileResponseSchema, response.data);
};

/**
 * 프로필 이미지 및 닉네임 수정
 * PATCH /v1/users/me/profile
 */
export const updateMyProfileApi = async (
  nickName?: string,
  profileImage?: File,
  options?: {
    age?: AgeGroup | null;
    occupation?: OccupationType | null;
    gender?: Gender | null;
  }
): Promise<UpdateMyProfileResponse> => {
  if (USE_MOCK) {
    return mockUpdateMyProfile(nickName, profileImage, options);
  }

  const formData = new FormData();

  // 백엔드 @RequestPart("profile_image")가 required이므로 파일 없을 땐 빈 Blob 전송
  formData.append('profile_image', profileImage ?? new Blob(), profileImage?.name ?? '');

  const contents: Record<string, unknown> = {};
  if (nickName !== undefined) contents.nickname = nickName;
  if (options?.age !== undefined) contents.age = options.age;
  if (options?.occupation !== undefined) contents.occupation = options.occupation;
  if (options?.gender !== undefined) contents.gender = options.gender;

  const contentsBlob = new Blob([JSON.stringify(contents)], {
    type: 'application/json',
  });
  formData.append('contents', contentsBlob);

  // 백엔드가 ApiResult로 래핑하지 않고 직접 반환
  const response = await api.patch<UpdateMyProfileResponse>('/users/me/profile', formData);

  return safeParse(UpdateMyProfileResponseSchema, response.data);
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
 * 로그아웃 API
 * POST /v1/auth/logout
 */
export const logoutApi = async (refreshToken: string): Promise<void> => {
  if (USE_MOCK) return;

  await api.post('/auth/logout', { refreshToken });
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

/**
 * 회원가입 (온보딩 정보 저장) API
 * PATCH /v1/users/signup
 */
export const signupApi = async (
  nickname: string,
  occupation: OccupationType,
  age: AgeGroup,
  gender: Gender,
  profileImage?: File
): Promise<void> => {
  if (USE_MOCK) return;

  const formData = new FormData();

  if (profileImage) {
    formData.append('profile_image', profileImage, profileImage.name);
  } else {
    formData.append('profile_image', new Blob(), '');
  }

  const contentsBlob = new Blob([JSON.stringify({ nickname, occupation, age, gender })], {
    type: 'application/json',
  });
  formData.append('contents', contentsBlob);

  await api.patch('/users/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
