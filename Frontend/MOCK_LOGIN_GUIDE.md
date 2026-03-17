# Mock 로그인 사용 설정

## 사용 방법

### 1. 환경 변수 설정

`.env.local` 파일에 다음을 추가하세요:

```env
NEXT_PUBLIC_USE_MOCK=true
```

### 2. Mock 사용자 계정

다음 계정들로 로그인 테스트가 가능합니다:

| 이메일             | 비밀번호      | 이름          |
| ------------------ | ------------- | ------------- |
| `test@mindlog.com` | `password123` | 테스트 사용자 |
| `demo@mindlog.com` | `demo123`     | 데모 사용자   |
| `user@mindlog.com` | `user123`     | 일반 사용자   |

### 3. 로그인 프로세스

1. `/login` 페이지로 이동
2. 소셜 로그인 버튼(카카오, 네이버, 구글) 클릭
3. Mock 데이터에서 자동으로 사용자 정보 조회
4. 로그인 성공 시 메인 페이지로 리다이렉트

### 4. 파일 구조

```
src/
├── mocks/
│   └── index.ts              # Mock 데이터 및 함수
├── lib/
│   ├── api/
│   │   └── index.ts          # loginApi, socialLoginApi 함수
│   └── axios.ts              # API 클라이언트 설정
├── stores/
│   └── auth.ts               # 인증 상태 관리 (Zustand)
├── types/
│   └── auth.ts               # 인증 관련 타입 정의
└── app/
    └── login/
        └── page.tsx          # 로그인 페이지
```

## Mock 데이터 커스터마이징

### 사용자 추가

`src/mocks/index.ts`의 `MOCK_USERS` 배열에 사용자를 추가하세요:

```typescript
export const MOCK_USERS: Array<User & { password: string }> = [
  // 기존 사용자들...
  {
    id: 4,
    email: 'newuser@mindlog.com',
    password: 'newpassword123',
    name: '새 사용자',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser',
  },
];
```

### 토큰 커스터마이징

`generateMockTokens()` 함수를 수정하여 토큰 형식을 변경할 수 있습니다.

## 실제 API 연동

Mock 모드를 비활성화하려면:

```env
NEXT_PUBLIC_USE_MOCK=false
```

또는 환경 변수를 제거하면 실제 API 엔드포인트로 요청이 전달됩니다.

## API 응답 형식

Mock이 반환하는 형식:

```typescript
{
  accessToken: string;       // JWT 토큰
  refreshToken: string;      // 갱신 토큰
  user: {
    id: number;
    email: string;
    name: string;
    profileImage?: string;
  };
}
```

## 토큰 저장소

- `localStorage.accessToken` - 액세스 토큰
- `localStorage.refreshToken` - 리프레시 토큰 (선택사항)
- `localStorage.auth-storage` - Zustand 인증 상태

## 디버깅

브라우저 콘솔에서 다음으로 확인 가능:

```javascript
// 현재 인증 상태 확인
useAuthStore.getState();

// 로컬스토리지 토큰 확인
localStorage.getItem('accessToken');
```
