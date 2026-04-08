import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

// 로그인 필요한 페이지들
const protectedRoutes = ['/signup', '/chat', '/collection', '/credit', '/shop', '/report', '/my'];

// 로그인 페이지들 (인증된 사용자는 접근 불가)
const authRoutes = ['/login'];

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const isTokenValid = (token: string): boolean => {
  if (USE_MOCK) return true;
  try {
    const { exp } = decodeJwt(token);
    return exp ? exp * 1000 > Date.now() : false;
  } catch {
    return false;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rawToken = request.cookies.get('accessToken')?.value;
  const token = rawToken && isTokenValid(rawToken) ? rawToken : null;

  // 홈('/') + 토큰 없음 → 브랜드 소개로
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/about', request.url));
    }
  }

  // 보호된 라우트 + 토큰 없음 → 로그인으로
  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 로그인/가입 페이지 + 토큰 있음 → 메인으로
  if (authRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
