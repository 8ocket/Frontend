import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 필요한 페이지들
const protectedRoutes = ['/', '/dashboard', '/profile', '/settings', '/chat', '/diary'];

// 로그인 페이지들 (인증된 사용자는 접근 불가)
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // localStorage에서 토큰 확인 (클라이언트 사이드이므로 쿠키 또는 다른 방식 권장)
  // 서버사이드에서는 쿠키로 확인
  const token = request.cookies.get('accessToken')?.value;

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

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

