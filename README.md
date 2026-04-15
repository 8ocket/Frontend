# 🧠 mindLog Frontend

**AI 기반 감정 분석 및 정신 건강 관리 서비스의 프론트엔드**

mindLog는 사용자의 감정을 AI가 분석하고, 상담, 감정 추적, 주간/월간 리포트 등을 통해 정신 건강을 관리하도록 돕는 서비스입니다. 이 저장소는 사용자 인터페이스와 클라이언트 로직을 담당합니다.

> KT Cloud Tech Up 실무 통합 프로젝트

---

## 🛠 기술 스택

### 핵심 프레임워크

| 구분          | 기술                        |
| ------------- | --------------------------- |
| **Framework** | Next.js 16.1.5 (App Router) |
| **Language**  | TypeScript (Strict Mode)    |
| **Runtime**   | React 19.2.3                |

### 상태 관리

| 구분                | 기술                      |
| ------------------- | ------------------------- |
| **클라이언트 상태** | Zustand 5.0               |
| **서버 상태**       | TanStack React Query 5.90 |
| **폼 상태**         | React Hook Form + Zod     |

### 데이터 & API

| 구분                | 기술                          |
| ------------------- | ----------------------------- |
| **HTTP 클라이언트** | Axios 1.13.3 (토큰 자동 갱신) |
| **검증**            | Zod (타입 안전)               |

### UI & 스타일링

| 구분           | 기술                                  |
| -------------- | ------------------------------------- |
| **CSS**        | Tailwind CSS 4 (@tailwindcss/postcss) |
| **컴포넌트**   | Radix UI + shadcn/ui (30+)            |
| **애니메이션** | Framer Motion                         |
| **테마**       | next-themes                           |

### 배포

| 구분     | 기술                                |
| -------- | ----------------------------------- |
| **배포** | Docker (standalone 최적화)          |
| **보안** | 헤더 설정 (X-Frame-Options, CSP 등) |

---

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router (파일 기반 라우팅)
│   ├── layout.tsx               # 루트 레이아웃 (Providers 초기화)
│   ├── globals.css              # 전역 스타일
│   ├── fonts/                   # Pretendard, Cormorant Garamond
│   ├── login/                   # 로그인 페이지
│   ├── signup/                  # 회원가입 & 닉네임 설정
│   ├── auth/                    # OAuth 콜백 (카카오, 구글)
│   ├── api/v1/                  # 내부 API 라우트
│   ├── error/506/               # 에러 페이지
│   ├── not-found.tsx            # 404 페이지
│   └── (main)/                  # 인증된 사용자 전용 섹션
│       ├── layout.tsx           # 메인 레이아웃 (GNB, Footer)
│       ├── page.tsx             # 홈 (대시보드)
│       ├── chat/                # AI 채팅 상담
│       ├── collection/          # 감정카드 컬렉션
│       ├── report/              # 주간/월간 리포트
│       ├── shop/                # 크레딧 구매
│       ├── my/                  # 마이페이지
│       ├── about/               # 소개 페이지
│       ├── support/             # 지원/문의
│       ├── terms/[key]/         # 동적 약관 페이지
│       └── payment/             # 결제 (성공/실패)
│
├── entities/                    # 비즈니스 로직 & 데이터 모델 (DDD 패턴)
│   ├── user/                   # 사용자 (로그인, 프로필)
│   │   ├── api.ts              # API 함수
│   │   ├── model.ts            # 타입 정의
│   │   ├── schema.ts           # Zod 검증 스키마
│   │   ├── store.ts            # Zustand 상태
│   │   └── index.ts
│   ├── session/                # 상담 세션
│   ├── emotion/                # 감정카드 (JOY, ANGER, SADNESS 등)
│   ├── reports/                # 주간/월간 리포트
│   ├── credits/                # 크레딧 (결제)
│   ├── attendance/             # 출석 & 캘린더
│   ├── summary/                # 통계 & 요약
│   └── index.ts
│
├── features/                   # 기능별 로직 & UI
│   ├── auth/                   # 로그인, OAuth 콜백
│   │   ├── useAuth.ts
│   │   ├── useAuthCallback.ts
│   │   └── components/
│   ├── send-message/           # 메시지 전송 (스트리밍)
│   ├── purchase-credit/        # 크레딧 구매 플로우
│   └── index.ts
│
├── shared/                     # 공유 유틸리티 & UI
│   ├── api/
│   │   ├── axios.ts            # Axios 인스턴스 (토큰 갱신 인터셉터)
│   │   └── index.ts
│   ├── ui/                     # 공통 UI 컴포넌트 (30+)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── checkbox-item.tsx
│   │   ├── toast.tsx           # 토스트 알림
│   │   ├── status-modal.tsx    # 상태 표시 모달
│   │   ├── ErrorState.tsx
│   │   ├── ComingSoon.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts            # 유틸 함수 (cn() 등)
│   │   ├── env.ts              # 환경변수
│   │   ├── utils/
│   │   │   ├── cookie.ts       # 쿠키 관리
│   │   │   ├── parse.ts        # 검증
│   │   │   ├── nickname.ts     # 닉네임 생성
│   │   │   └── error.ts
│   │   └── hooks/
│   │       └── useGnbTheme.ts
│   └── constants/
│
├── widgets/                    # 합성된 기능 블록
│   ├── gnb/                    # 상단 네비게이션 바
│   ├── chat-main-area/         # 채팅 메인 영역
│   ├── chat-sidebar/           # 채팅 사이드바
│   └── emotion-card/           # 감정카드 표시
│
├── components/                 # 페이지/기능별 컴포넌트 (23+)
├── providers/                  # React Context Providers
│   ├── query-provider.tsx      # React Query (staleTime: 1분)
│   └── theme-provider.tsx      # 테마 관리
├── types/                      # 타입 정의
│   ├── credit.ts
│   ├── crisis.ts
│   ├── notification.ts
│   └── index.ts
├── constants/                  # 앱 전역 상수
├── mocks/                      # Mock 데이터 (개발/테스트)
└── middleware.ts               # Next.js 미들웨어
```

### 디렉토리별 역할

| 디렉토리      | 역할                                                     |
| ------------- | -------------------------------------------------------- |
| `app/`        | Next.js 파일 기반 라우팅, 페이지 레이아웃                |
| `entities/`   | API 함수, 모델, 스키마, 상태 스토어 (비즈니스 로직 중심) |
| `features/`   | 페이지에서 사용하는 고급 기능 (인증, 메시지 전송 등)     |
| `shared/`     | 여러 페이지에서 공유하는 UI, 유틸, API                   |
| `widgets/`    | 여러 컴포넌트를 조합한 큰 기능 블록                      |
| `components/` | 페이지/기능별 중간 크기 컴포넌트                         |

---

## ✨ 주요 기능

### 🔑 인증

- 이메일/비밀번호 로그인
- 카카오, 구글 OAuth
- 자동 토큰 갱신 (401 응답 시)
- 닉네임 설정

### 🏠 홈 (대시보드)

- 사용자 인사말 헤더
- 월간 출석 캘린더 & 주간 도장판
- 자동 슬라이드 배너 (4초 간격)
- 주간/월간 리포트 달성률 (애니메이션)
- 감정카드 스크롤 컬렉션
- 플로팅 AI 상담 버튼

### 💬 AI 채팅 상담

- 실시간 스트리밍 응답
- 세션 관리
- 채팅 히스토리 (사이드바)
- 새 채팅 시작
- 감정 레이블링

### 🎭 감정카드 컬렉션

- 감정 카테고리별 필터링
- 색상 범례 (JOY, ANGER, SADNESS 등)
- 반응형 그리드 레이아웃

### 📊 주간/월간 리포트

- 주간 요약 & 통계
- 월간 분석
- 상세 조회

### 💳 크레딧 구매 (결제)

- 상품 카드 표시
- 토스 결제 연동
- 결제 성공/실패 처리

### 👤 마이페이지

- 프로필 정보 수정
- 사용자 설정

---

## 🚀 시작하기

### 선행조건

- **Node.js** 18+
- **npm** / **yarn** / **bun**

### 설치 및 실행

```bash
cd Frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저로 http://localhost:3000 접속
```

### 개발 명령어

```bash
# 개발 서버 (터보모드)
npm run dev:turbo

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm start

# 린트 (ESLint)
npm run lint

# 포맷팅 (Prettier)
npm run format

# 타입 체크
npm run typecheck

# 전체 개발 (Backend + Frontend)
npm run dev:all
```

---

## 🔐 환경변수

`.env.local` 파일을 생성하고 설정하세요:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8080/v1

# Mock Mode
NEXT_PUBLIC_USE_MOCK=false

# 카카오 OAuth
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_kakao_rest_api_key
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback

# 구글 OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# 토스 결제 (테스트 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
```

---

## 📱 라우팅

### 공개 페이지 (비인증)

| 경로                    | 설명              |
| ----------------------- | ----------------- |
| `/login`                | 로그인            |
| `/signup`               | 회원가입          |
| `/signup/nickname`      | 닉네임 설정       |
| `/auth/kakao/callback`  | 카카오 OAuth 콜백 |
| `/auth/google/callback` | 구글 OAuth 콜백   |

### 보호된 페이지 (인증 필수)

| 경로               | 설명             |
| ------------------ | ---------------- |
| `/`                | 홈 (대시보드)    |
| `/chat`            | AI 채팅 상담     |
| `/collection`      | 감정카드 컬렉션  |
| `/report`          | 주간/월간 리포트 |
| `/shop`            | 크레딧 구매      |
| `/my`              | 마이페이지       |
| `/about`           | 소개 페이지      |
| `/support`         | 지원/문의        |
| `/terms/[key]`     | 약관 상세        |
| `/payment/success` | 결제 완료        |
| `/payment/fail`    | 결제 실패        |

---

## 🔨 개발 가이드

### 폴더 구조 이해하기

**entities/** 폴더에서 시작하세요:

```typescript
// user 엔티티 예시
src/entities/user/
├── api.ts          # API 호출 함수 (loginUser, getProfile 등)
├── model.ts        # 타입 정의 (User, LoginResponse 등)
├── schema.ts       # Zod 검증 스키마
├── store.ts        # Zustand 상태 스토어
└── index.ts        # 내보내기

// 사용 예시
import { loginUser } from '@/entities/user/api'
import { useUserStore } from '@/entities/user/store'
```

### API 호출 패턴

```typescript
// React Query 사용
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/entities/user/api'

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getProfile,
  })
  return <div>{data?.nickname}</div>
}

// 뮤테이션 (POST/PUT/DELETE)
import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '@/entities/user/api'

function EditProfile() {
  const { mutate } = useMutation({
    mutationFn: updateProfile,
  })
  return <button onClick={() => mutate(newData)}>저장</button>
}
```

### 토큰 자동 갱신

Axios 인터셉터에서 자동 처리됩니다:

- 401 에러 발생 시 refreshToken으로 새 accessToken 요청
- 원래 요청 자동 재시도
- 동시 요청은 큐에서 대기

```typescript
// src/shared/api/axios.ts 참고
```

### 폼 검증 패턴

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/entities/user/schema'

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  )
}
```

### Mock 모드

개발/테스트 시 실제 API 호출 대신 mock 데이터 사용:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true
```

```typescript
import { USE_MOCK } from '@/shared/lib/env';

if (USE_MOCK) {
  // mock 데이터 로직
}
```

### UI 컴포넌트 사용

```typescript
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card } from '@/shared/ui/card'
import { Dialog } from '@/shared/ui/dialog'
import { Tabs } from '@/shared/ui/tabs'

export function Example() {
  return (
    <Card>
      <Dialog>
        <Button>열기</Button>
        <Input placeholder="입력..." />
      </Dialog>
    </Card>
  )
}
```

### 애니메이션 (Framer Motion)

```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  페이드인 애니메이션
</motion.div>
```

---

## 🏗 상태 관리 아키텍처

### Zustand (클라이언트 상태)

```typescript
import { useUserStore } from '@/entities/user/store';

const user = useUserStore((state) => state.user);
const logout = useUserStore((state) => state.logout);
```

### React Query (서버 상태)

```typescript
// 캐시: staleTime=1분, gcTime=5분
useQuery({
  queryKey: ['user', 'profile'],
  queryFn: getProfile,
});
```

### 폼 상태 (React Hook Form)

```typescript
const { register, watch, formState } = useForm({
  resolver: zodResolver(schema),
  defaultValues: initialData,
});
```

---

## 🐛 문제 해결

### "401 Unauthorized" 반복

- 토큰 만료 확인
- `.env.local`의 `NEXT_PUBLIC_API_URL` 확인
- 백엔드 서버 실행 확인 (일반적으로 `http://localhost:8080`)

### React Query 캐시 문제

```typescript
// 캐시 무효화
queryClient.invalidateQueries({ queryKey: ['user'] });

// 모든 캐시 초기화
queryClient.clear();
```

### 스타일 미적용

```bash
npm run dev -- --turbo
```

---

## 📦 배포

### Docker 빌드

```bash
npm run build
docker build -t mindlog-frontend:latest .
docker run -p 3000:3000 mindlog-frontend:latest
```

### 환경별 빌드

```bash
npm run build  # 프로덕션
```

---

## 👥 팀원

- [@lnu8926-web](https://github.com/lnu8926-web)
- [@choitaeung-cloud](https://github.com/choitaeung-cloud)

---

**Last Updated**: 2026-04-15
