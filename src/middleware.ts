import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 필요한 페이지들
const protectedRoutes = [
  '/',
  '/signup',
  '/chat',
  '/collection',
  '/credit',
  '/shop',
  '/report',
  '/my',
  '/about',
];

// 로그인 페이지들 (인증된 사용자는 접근 불가)
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
