직# 🧠 mindLog Frontend

**AI 기반 감정 분석 및 정신 건강 관리 웹 서비스**

mindLog는 사용자가 AI와 상담하며 감정을 기록하고, 주간/월간 리포트로 감정 패턴을 분석하며 정신 건강을 관리하는 서비스입니다.

> **프로젝트**: KT Cloud Tech Up 실무 통합 프로젝트  
 🚀

---

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [환경 설정](#환경-설정)
- [개발 가이드](#개발-가이드)

---

## ✨ 주요 기능

### 🔑 인증

- **이메일/비밀번호 로그인**
- **Oauth 소셜 로그인** (카카오, 구글)
- **자동 토큰 갱신** (Axios 401 인터셉터)
- **회원가입 및 닉네임 설정**
- **프로필 관리** (사진, 프로필 정보, 닉네임)

### 🏠 홈 (대시보드)

- **월간 출석 캘린더** (달력 형식 출석 기록)
- **주간 도장판** (월-일 요일별 진행 상황)
- **자동 슬라이드 배너** (4초 간격, 3개 배너)
- **주간/월간 리포트 달성률 위젯** (진행도 표시, 애니메이션)
- **세션 진행도** (리포트 생성 가능 조건)
- **감정카드 컬렉션 미리보기** (최근 카드 스크롤)

### 💬 AI 채팅 상담

- **세션 생성 및 관리** (새로운 상담 시작)
- **스트리밍 응답** (실시간 AI 응답 표시)
- **세션 히스토리** (좌측 사이드바 - 이전 대화 목록)
- **세션 상세 조회** (채팅 기록 보기)
- **미완성 세션 모달** (이전 대화 계속하기 옵션)
- **감정 레이블 추가** (상담 완료 후 감정 선택)
- **감정카드 생성** (AI 응답 기반 감정카드 자동 생성 - SVG→PNG 변환)
- **세션 삭제**
- **크레딧 부족 경고** (크레딧 부족 시 모달 표시)

### 🎭 감정카드 컬렉션

- **감정카드 그리드 표시** (생성된 모든 감정카드 전시)
- **카드 날짜 표시** (YYYY.MM.DD 형식)
- **감정카드 상세 보기** (확대 오버레이)
- **감정 색상 범례** (JOY, ANGER, SADNESS, ANXIETY, HOPEFUL, CALM 등)
- **반응형 레이아웃** (화면 너비에 따라 카드 크기 동적 조정)
- **카드 호버 효과** (스케일 및 섀도우 애니메이션)
- **카드 다운로드** (감정카드 이미지 저장)

### 📊 주간/월간 리포트

- **리포트 목록 조회** (주간/월간 리포트 목록)
- **리포트 생성** (주간/월간 선택 후 생성)
- **생성 상태 추적** (생성 중, 분석 중 상태 표시)
- **리포트 상세 보기** (텍스트 기반 분석 결과)
- **리포트 삭제**
- **리포트 생성 실패 처리** (실패 원인 표시)
- **크레딧 소비량 안내** (리포트당 필요 크레딧 표시)

### 💳 크레딧 시스템

- **크레딧 상품 페이지**
  - 소형 (200 크레딧, 2,200원)
  - 중형 (500 크레딧, 4,900원)
  - 대형 (1,200 크레딧, 10,900원)
- **크레딧 상품별 사용 범위 안내**
- **토스 페이먼츠 결제**
- **결제 성공/실패 페이지**
- **크레딧 잔액 표시** (GNB에 실시간 반영)

### 👤 마이페이지

- **프로필 정보 조회**
  - 닉네임, 이메일, 성별, 나이, 직업
  - 프로필 사진 미리보기
- **프로필 수정** (드로어 형식)
  - 닉네임 변경
  - 성별 선택 (남/여)
  - 나이 선택 (20/30/40)
  - 직업 선택 (학생, 직장인, 자영업자, 기타)
  - 프로필 사진 업로드
- **결제 내역 조회**
  - 거래 유형별 표시 (회원가입 보너스, 충전, 리포트 생성 등)
  - 거래 시간 (KST 기준)
  - 크레딧 증감 표시
- **결제 환불** (결제 취소 가능)
- **로그아웃**
- **회원 탈퇴**

---

## 🛠 기술 스택

### Core Framework

| 항목 | 기술 | 버전 |
|------|------|------|
| **Framework** | Next.js (App Router) | 16.1.5 |
| **Runtime** | React | 19.2.3 |
| **Language** | TypeScript (Strict) | 5.x |

### State Management

| 항목 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **전역 상태** | Zustand | 5.0.10 | 사용자, 크레딧, 테마 상태 |
| **서버 상태** | TanStack React Query | 5.90.20 | API 캐싱, 자동 동기화 (staleTime: 1분) |
| **폼 상태** | React Hook Form | 7.71.1 | 폼 검증 및 관리 |
| **검증** | Zod | 4.3.6 | 타입 안전 스키마 (API 응답) |

### UI & Styling

| 항목 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **CSS** | Tailwind CSS | 4.x | 유틸리티 기반 스타일 |
| **CSS 변수** | @tailwindcss/postcss | 4.x | PostCSS 처리 |
| **UI 라이브러리** | Radix UI | 1.4.3 | 접근성 컴포넌트 기반 |
| **UI 컴포넌트** | shadcn/ui | - | Button, Dialog, Input, Tabs, Popover 등 30+ 컴포넌트 |
| **애니메이션** | Framer Motion | 12.38.0 | 스트리밍 응답, 카드 전환, 모달 |
| **애니메이션** | Motion | 12.38.0 | 추가 애니메이션 유틸 |
| **아이콘** | Lucide React | 0.563.0 | 통일된 아이콘 셋 |
| **테마** | next-themes | 0.4.6 | 라이트/다크 모드 전환 |
| **차트** | Recharts | 3.8.0 | 리포트 통계 그래프 |
| **날짜 선택** | react-day-picker | 9.14.0 | 캘린더 UI |
| **유틸** | clsx, tailwind-merge | 2.x, 3.4.0 | 클래스명 병합 |

### API & Communication

| 항목 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **HTTP 클라이언트** | Axios | 1.13.3 | API 요청, 토큰 자동 갱신 (401 처리) |
| **Form 입력** | @hookform/resolvers | 5.2.2 | Zod 스키마와 폼 통합 |
| **JWT 처리** | jose | 6.2.0 | 액세스/리프레시 토큰 검증 |
| **마크다운** | react-markdown | 10.1.0 | 리포트 텍스트 렌더링 |
| **마크다운 플러그인** | remark-gfm | 4.0.1 | GitHub Flavored Markdown |

### 결제 & 이미지

| 항목 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **결제 SDK** | @tosspayments/payment-sdk | 1.9.2 | 토스 페이먼츠 결제 |
| **이미지 변환** | html-to-image | 1.11.13 | 감정카드 SVG→PNG 변환 |
| **캐러셀** | swiper | 12.1.2 | 배너, 카드 슬라이드 |
| **닉네임 생성** | unique-names-generator | 4.7.1 | 랜덤 닉네임 생성 |

### 개발 도구

| 항목 | 기술 | 버전 |
|------|------|------|
| **린터** | ESLint | 9.x |
| **포매터** | Prettier | 3.4.2 |
| **Tailwind 플러그인** | prettier-plugin-tailwindcss | 0.6.9 |
| **웹 폰트** | Pretendard | 1.3.9 |
| **병렬 실행** | concurrently | 9.2.1 |

---

## 📁 프로젝트 구조

### Next.js 파일 기반 라우팅

```
src/app/
├── layout.tsx                   # Root 레이아웃 (Providers 초기화)
├── globals.css                  # 전역 스타일
├── login/
│   └── page.tsx                # 로그인 페이지 (이메일/비밀번호, Oauth)
├── signup/
│   ├── page.tsx                # 회원가입 페이지
│   └── nickname/
│       └── page.tsx            # 닉네임 설정 페이지
├── auth/
│   ├── kakao/callback/
│   │   └── page.tsx            # 카카오 OAuth 콜백
│   └── google/callback/
│       └── page.tsx            # 구글 OAuth 콜백
├── api/v1/
│   └── ...                     # 내부 API 라우트 (토큰 갱신 등)
├── error/
│   └── 506/
│       └── page.tsx            # 500 에러 페이지
├── not-found.tsx               # 404 페이지
│
└── (main)/                     # 인증된 사용자 전용 그룹 라우트
    ├── layout.tsx              # 메인 레이아웃 (GNB, 푸터)
    ├── page.tsx                # 홈 (대시보드)
    ├── chat/
    │   └── page.tsx            # AI 채팅 상담 페이지
    ├── collection/
    │   └── page.tsx            # 감정카드 컬렉션 페이지
    ├── report/
    │   └── page.tsx            # 주간/월간 리포트 페이지
    ├── shop/
    │   └── page.tsx            # 크레딧 구매 페이지
    ├── my/
    │   └── page.tsx            # 마이페이지
    ├── about/
    │   └── page.tsx            # 소개 페이지
    ├── support/
    │   └── page.tsx            # 지원/문의 페이지
    ├── terms/
    │   └── [key]/
    │       └── page.tsx        # 동적 약관 페이지
    └── payment/
        └── page.tsx            # 결제 결과 페이지 (성공/실패)
```

### Business Logic & Data Models (DDD 패턴)

```
src/entities/
├── user/                       # 사용자 인증 & 프로필
│   ├── api.ts                  # API: login, signup, getProfile, updateProfile, withdraw
│   ├── model.ts                # 타입: User, AuthResponse, UserProfile
│   ├── schema.ts               # Zod 검증 스키마
│   ├── store.ts                # Zustand: 사용자 상태, 인증 토큰
│   └── index.ts
├── session/                    # AI 채팅 세션
│   ├── api.ts                  # API: createSession, getSession, finalizeSession, deleteSession
│   ├── model.ts                # 타입: SessionDetail, FinalizeEvent, SessionList
│   ├── schema.ts               # Zod 검증 스키마
│   ├── utils.ts                # 세션→감정카드 변환 유틸
│   └── index.ts
├── emotion/                    # 감정카드
│   ├── api.ts
│   ├── model.ts                # 타입: EmotionType, EmotionCard
│   ├── schema.ts
│   └── index.ts
├── reports/                    # 주간/월간 리포트
│   ├── api.ts                  # API: createReport, getReports, deleteReport
│   ├── model.ts                # 타입: Report, ReportStatus, ReportEvent
│   ├── schema.ts               # Zod 검증 스키마
│   └── index.ts
├── summary/                    # 감정카드 (Collection)
│   ├── api.ts                  # API: getSummaryList, uploadCardImage
│   ├── model.ts                # 타입: SummaryItem, ImageUrl
│   ├── schema.ts
│   └── index.ts
├── credits/                    # 크레딧 & 결제
│   ├── api.ts                  # API: getProducts, getMyCreditgetPaymentHistory, cancelPayment
│   ├── model.ts                # 타입: CreditProduct, PaymentHistory
│   ├── schema.ts               # Zod 검증 스키마
│   ├── store.ts                # Zustand: 크레딧 잔액
│   └── index.ts
├── attendance/                 # 월간 출석 & 캘린더
│   ├── api.ts                  # API: getAttendance(yearMonth)
│   ├── model.ts                # 타입: AttendanceResponse
│   ├── schema.ts
│   └── index.ts
└── index.ts
```

### Features (기능별 로직)

```
src/features/
├── auth/                       # 인증 로직
│   ├── useAuth.ts              # Hook: 로그인, OAuth 처리
│   ├── useAuthCallback.ts      # Hook: OAuth 콜백 처리
│   └── components/             # 로그인 폼 UI
├── send-message/               # 메시지 전송 (스트리밍)
│   └── ...                     # 채팅 메시지 전송 로직
├── purchase-credit/            # 크레딧 구매 플로우
│   ├── CreditProductCard.tsx
│   ├── PurchaseConfirmDialog.tsx
│   └── RefundPolicyNotice.tsx
└── index.ts
```

### Shared (공유 리소스)

```
src/shared/
├── api/
│   ├── axios.ts                # Axios 인스턴스 (401 자동 갱신, 인터셉터)
│   └── index.ts
├── ui/                         # 30+ 공통 UI 컴포넌트
│   ├── button.tsx
│   ├── dialog.tsx              # @radix-ui/react-dialog 래퍼
│   ├── input.tsx
│   ├── tabs.tsx                # @radix-ui/react-tabs 래퍼
│   ├── card.tsx
│   ├── status-modal.tsx        # 상태 표시 모달
│   ├── toast.tsx               # 토스트 알림
│   ├── profile-avatar.tsx
│   ├── ErrorState.tsx
│   ├── ComingSoon.tsx
│   └── ...
├── lib/
│   ├── utils.ts                # cn() 클래스 병합 등
│   ├── env.ts                  # 환경변수 관리
│   ├── chatNavigationStore.ts  # 채팅 네비게이션 상태
│   ├── utils/
│   │   ├── cookie.ts           # getCookie, setCookie
│   │   ├── parse.ts            # 데이터 검증 유틸
│   │   ├── nickname.ts         # 닉네임 생성
│   │   └── error.ts            # 에러 처리 유틸
│   └── hooks/
│       ├── useGnbTheme.ts      # GNB 테마 훅
│       └── ...
└── constants/
```

### Widgets (합성된 기능 블록)

```
src/widgets/
├── gnb/                        # Global Navigation Bar
│   ├── gnb.tsx                 # 상단 네비게이션 바
│   └── ...
├── chat-main-area/            # 채팅 메인 영역
│   ├── ChatMainArea.tsx
│   └── ...
├── chat-sidebar/              # 채팅 사이드바 (세션 목록)
│   ├── ChatSidebar.tsx
│   └── ...
├── emotion-card/              # 감정카드 표시 및 동작
│   ├── EmotionCard.tsx
│   ├── EmotionCardFront.tsx
│   ├── EmotionCardBack.tsx
│   └── ...
└── emotion-color-legend/      # 감정 색상 범례
    └── ...
```

### Page/Feature Components

```
src/components/
├── about/                      # 소개 페이지 컴포넌트
├── chat/                       # 채팅 관련 컴포넌트
│   ├── ChatAlertModal.tsx
│   ├── ChatCreditModal.tsx
│   ├── ChatNewSessionModal.tsx
│   ├── ChatUnfinishedSessionModal.tsx
│   └── ...
├── my/                         # 마이페이지 컴포넌트
│   ├── ProfileEditDrawer.tsx
│   └── ...
└── report/                     # 리포트 관련 컴포넌트
    ├── ReportSidebar.tsx
    ├── ReportCreationForm.tsx
    ├── ReportDetail.tsx
    ├── ReportPolling.tsx
    ├── ReportError.tsx
    ├── DeleteReportModal.tsx
    ├── ReportCreditModal.tsx
    └── ...
```

### Providers & Types

```
src/
├── providers/                  # React Context Providers
│   ├── query-provider.tsx      # React Query (staleTime: 1분)
│   └── theme-provider.tsx      # next-themes 프로바이더
├── types/                      # 전역 타입
│   ├── credit.ts
│   ├── crisis.ts
│   ├── notification.ts
│   └── index.ts
├── constants/                  # 앱 전역 상수
├── mocks/                      # Mock 데이터 (개발/테스트)
│   ├── user.ts
│   ├── session.ts
│   ├── emotion.ts
│   ├── report.ts
│   ├── credits.ts
│   └── index.ts
└── middleware.ts               # Next.js 미들웨어
```

---

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/8ocket/Frontend.git
cd Frontend
```

### 2. 의존성 설치

```bash
npm install
# 또는
pnpm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성합니다.

```bash
cp .env.example .env.local
```

필수 환경 변수:
```env
# API 서버
NEXT_PUBLIC_API_URL=http://localhost:8080/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# OAuth
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_OAUTH_REDIRECT_URI=http://localhost:3000

# 결제
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key

# 개발 환경
NEXT_PUBLIC_APP_ENV=development
```

### 4. 개발 서버 실행

#### 프론트엔드만 실행

```bash
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

#### 전체 스택 실행 (AI Docker + 백엔드 + 프론트엔드)

```bash
npm run dev:all
```

필수 조건:
- 백엔드: Spring Boot 서버 (`:8080`)
- AI: Docker (AI 서비스)

#### Turbo 모드 (개선된 HMR)

```bash
npm run dev:turbo
```

### 5. 프로덕션 빌드 & 실행

```bash
# 빌드
npm run build

# 실행
npm run start
```

---

## ⚙️ 개발 가이드

### 코드 품질 검사

```bash
# 전체 검사 (타입 + 린트 + 포매팅)
npm run check

# 각각 실행
npm run type-check      # TypeScript 타입 검사
npm run lint            # ESLint 검사
npm run format:check    # Prettier 포매팅 검사
```

### 자동 수정

```bash
# ESLint 자동 수정
npm run lint:fix

# Prettier 포매팅
npm run format
```

### 캐시 초기화

```bash
npm run clean
```

---

## 🔧 아키텍처 패턴

### 1. DDD (Domain-Driven Design) in `entities/`

각 도메인은 독립적인 폴더:

```typescript
src/entities/user/
  - api.ts       # API 요청 함수들
  - model.ts     # 타입 정의
  - schema.ts    # Zod 검증 스키마
  - store.ts     # Zustand 전역 상태
  - index.ts     # 공개 인터페이스
```

**예시**: 사용자 프로필 가져오기

```typescript
// entities/user/api.ts
export const getMyProfileApi = async (): Promise<UserProfileResponse> => {
  const response = await api.get<UserProfileResponse>('/user/profile');
  return safeParse(UserProfileResponseSchema, response.data);
};

// app/(main)/my/page.tsx
const { data: profile } = useQuery({
  queryKey: ['myProfile'],
  queryFn: getMyProfileApi,
});
```

### 2. React Query + Zustand 조합

**React Query**: 서버 상태 (API 데이터)
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['sessions'],
  queryFn: getSessionsApi,
  staleTime: 1000 * 60, // 1분 캐시
});
```

**Zustand**: 클라이언트 상태 (사용자, 크레딧, 테마)
```typescript
const { user, setUser } = useAuthStore();
const { totalCredit } = useCreditStore();
```

### 3. 폼 검증 (React Hook Form + Zod)

```typescript
const schema = z.object({
  email: z.string().email('유효한 이메일이 아닙니다'),
  password: z.string().min(8, '8자 이상'),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### 4. Axios 인터셉터 (자동 토큰 갱신)

401 응답 시 자동으로 토큰 갱신:

```typescript
// shared/api/axios.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 갱신 후 재시도
    }
  }
);
```

### 5. 스트리밍 응답 처리 (채팅)

```typescript
// 백엔드에서 SSE로 스트리밍
const stream = await finalizeSessionStream(sessionId);
for await (const event of stream) {
  // 실시간 응답 업데이트
}
```

---

## 📊 주요 기능 구현 예시

### AI 채팅 플로우

1. **세션 생성**
   - `createSessionApi()` → 새 세션 ID 획득
   
2. **메시지 전송** (스트리밍)
   - `sendMessageStream()` → 실시간 응답
   - `message` 이벤트로 점진적 업데이트
   
3. **감정카드 생성**
   - `finalizeSessionStream()` → AI 분석 감정
   - `html-to-image`로 SVG→PNG 변환
   - `uploadSummaryCardImageApi()` → 이미지 업로드

4. **세션 저장**
   - 로컬 스토어에 히스토리 추가
   - React Query 캐시 업데이트

### 리포트 생성 프로세스

1. **리포트 생성 요청**
   - `createReportApi(type)` → 생성 시작
   
2. **상태 폴링**
   - `ReportPolling` 컴포넌트로 상태 모니터링
   - `generating` → `complete` 상태 전환
   
3. **결과 표시**
   - `ReportDetail` 컴포넌트로 분석 결과 표시

---

## 🔐 인증 플로우

### 이메일/비밀번호

```
/login → loginApi() → 토큰 저장 → Redirect to /
```

### OAuth (카카오/구글)

```
/auth/kakao/callback?code=xxx
  → kakaoLoginApi(code)
  → 토큰 저장
  → Redirect to /
```

---

## 📱 반응형 디자인

- **모바일**: < 640px
- **태블릿**: 640px ~ 1024px
- **데스크톱**: > 1024px

Tailwind CSS로 모든 컴포넌트가 반응형 처리됨

---

## 🐳 Docker 배포

### 이미지 빌드

```bash
docker build -t mindlog-frontend:latest .
```

### 컨테이너 실행

```bash
docker run -p 3000:3000 mindlog-frontend:latest
```

---

## 🚨 Common Issues

### 401 Unauthorized 반복

**원인**: 토큰 갱신 실패  
**해결**: `.env.local`의 `NEXT_PUBLIC_API_URL` 확인

### 이미지 업로드 실패

**원인**: 이미지 변환 실패 (html-to-image)  
**해결**: 브라우저 콘솔에서 SVG 렌더링 오류 확인

### React Query 캐시 문제

**해결**:
```typescript
queryClient.invalidateQueries({ queryKey: ['sessions'] });
```

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 19 공식 문서](https://react.dev)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [React Query 문서](https://tanstack.com/query/latest)
- [Zod 공식 문서](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)

---

## 🤝 기여 가이드

1. 새 브랜치 생성
   ```bash
   git checkout -b feature/기능-이름
   ```

2. 변경 후 커밋
   ```bash
   git commit -m "feat: 기능 설명"
   ```

3. 푸시
   ```bash
   git push origin feature/기능-이름
   ```

4. Pull Request 생성

---

**Last Updated**: 2026년 4월 26일
