# ── Stage 1: deps ─────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: builder ───────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 빌드 시 필요한 환경변수 (ARG → ENV로 주입)
# ※ 아래 값은 docker build --build-arg 로 전달해야 합니다
# ※ 테스트 도메인 확정 후 Redirect URI를 실제 도메인으로 변경해주세요

# 백엔드 API 주소 — 인프라 팀에서 제공
ARG NEXT_PUBLIC_API_URL

# 운영 배포 시 false 고정
ARG NEXT_PUBLIC_USE_MOCK=false

# 카카오 OAuth — REST API 키 (카카오 개발자 콘솔)
ARG NEXT_PUBLIC_KAKAO_REST_API_KEY
# 카카오 Redirect URI — 테스트 도메인 확정 후 변경 필요 (예: https://도메인/auth/callback)
ARG NEXT_PUBLIC_KAKAO_REDIRECT_URI

# 구글 OAuth — Client ID (Google Cloud Console)
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
# 구글 Redirect URI — 테스트 도메인 확정 후 변경 필요 (예: https://도메인/auth/google/callback)
ARG NEXT_PUBLIC_GOOGLE_REDIRECT_URI

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK
ENV NEXT_PUBLIC_KAKAO_REST_API_KEY=$NEXT_PUBLIC_KAKAO_REST_API_KEY
ENV NEXT_PUBLIC_KAKAO_REDIRECT_URI=$NEXT_PUBLIC_KAKAO_REDIRECT_URI
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_REDIRECT_URI=$NEXT_PUBLIC_GOOGLE_REDIRECT_URI

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: runner ────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 빌드 결과물 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
