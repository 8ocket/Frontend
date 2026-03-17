import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
);

interface KakaoUserData {
  id: number;
  kakao_account: {
    email?: string;
    profile: {
      nickname?: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
  };
}

interface UserData {
  id: string;
  kakaoId: string;
  email?: string;
  name?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DB에 사용자 정보 저장 (Upsert)
 */
export async function saveUserToDB(kakaoData: KakaoUserData): Promise<UserData> {
  try {
    const kakaoId = String(kakaoData.id);
    const email = kakaoData.kakao_account?.email;
    const name = kakaoData.kakao_account?.profile?.nickname;
    const profileImage = kakaoData.kakao_account?.profile?.profile_image_url;

    // TODO: Prisma 등의 DB 연동 코드
    // 예: const user = await prisma.user.upsert({ ... })

    // 임시 구현 (실제로는 DB 저장 필요)
    const user: UserData = {
      id: kakaoId,
      kakaoId,
      email,
      name,
      profileImage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return user;
  } catch (error) {
    console.error('Error saving user to DB:', error);
    throw new Error('사용자 저장 실패');
  }
}

/**
 * AccessToken 생성 (JWT)
 */
export async function generateAccessToken(user: UserData): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    kakaoId: user.kakaoId,
    email: user.email,
    name: user.name,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  return token;
}

/**
 * RefreshToken 생성 (JWT)
 */
export async function generateRefreshToken(user: UserData): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    kakaoId: user.kakaoId,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshSecret);

  return token;
}
