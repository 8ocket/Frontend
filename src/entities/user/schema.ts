import { z } from 'zod';

// 공통 API 응답 래퍼
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
      })
      .optional(),
  });

// 사용자 기본 정보
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  profileImage: z.string().optional(),
  createdAt: z.string().optional(),
});

// 인증 응답
export const AuthResponseSchema = z.object({
  isNewUser: z.boolean(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: UserSchema,
});

// 카카오/구글 로그인 응답
export const SocialLoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  isNewUser: z.boolean(),
});

// 토큰 갱신 응답
export const RefreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  is_new_user: z.boolean().nullable(),
});

// OccupationType / AgeGroup / Gender
export const OccupationTypeSchema = z.enum(['STUDENT', 'JOB_SEEKER', 'EMPLOYEE', 'CAREER_SWITCHER']);
export const AgeGroupSchema = z.union([z.literal(20), z.literal(30), z.literal(40)]);
export const GenderSchema = z.enum(['MALE', 'FEMALE']);

// 프로필 조회 응답
export const UserProfileResponseSchema = z.object({
  user_id: z.string(),
  profile_image_url: z.string().optional(),
  nickname: z.string(),
  nickname_change_count: z.number(),
  age_group: AgeGroupSchema.nullable().optional(),
  occupation: OccupationTypeSchema.nullable().optional(),
  gender: GenderSchema.nullable().optional(),
});

// 프로필 수정 응답
export const UpdateMyProfileResponseSchema = z.object({
  user_id: z.string(),
  profile_image_url: z.string().optional(),
  nickname: z.string(),
  updated_at: z.string(),
  age_group: AgeGroupSchema.nullable().optional(),
  occupation: OccupationTypeSchema.nullable().optional(),
  gender: GenderSchema.nullable().optional(),
});

// 닉네임 검증 스키마
export const NicknameSchema = z
  .string()
  .min(2, '닉네임은 2자 이상이어야 합니다.')
  .max(30, '닉네임은 30자 이하여야 합니다.');
