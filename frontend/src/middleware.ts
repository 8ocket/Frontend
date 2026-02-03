import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 필요한 페이지들
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// 로그인 후 접근 불가 페이지들
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 쿠키에서 토큰 확인 (또는 다른 방식)
  // TODO: 백엔드 토큰 방식에 맞게 수정
  const token = request.cookies.get('accessToken')?.value;

  // 보호된 라우트 + 토큰 없음 → 로그인으로
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 로그인 페이지 + 토큰 있음 → 메인으로
  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
