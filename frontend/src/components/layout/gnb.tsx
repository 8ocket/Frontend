'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';
import { LogoSmall } from '../login';

// Figma: GNB (1738:4600)
// 1440x80
// Light mode: bg secondary-100 (#f8fafc) — 흰색, 텍스트 dark
// Dark mode:  bg prime-900 (#1a222e)     — 네이비, 텍스트 light

const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: 'AI 상담', href: '/chat' },
  { label: '브랜드 소개', href: '/about' },
  { label: '마음기록 모음', href: '/collection' },
  { label: '심화 리포트', href: '/report' },
  { label: '상점', href: '/shop' },
] as const;

const AUTH_NAV = { label: '고객지원', href: '/credit' } as const;

export function GNB() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-secondary-100 dark:bg-prime-900 dark:border-prime-800 w-full border-b border-neutral-200">
      <nav className="layout-container flex h-20 items-center justify-between px-6">
        {/* 로고 영역 - 추후 작업 */}
        <div className="w-60">마인드로그</div>

        {/* 메뉴 */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <NavItem key={href} label={label} href={href} active={pathname === href} />
          ))}

          {isAuthenticated && (
            <NavItem
              label={AUTH_NAV.label}
              href={AUTH_NAV.href}
              active={pathname === AUTH_NAV.href}
            />
          )}

          {isAuthenticated ? (
            <>
              <NavItem label="마이페이지" href="/my" active={pathname === '/my'} />
              <button
                onClick={handleLogout}
                className={cn(
                  'h-11 rounded-full px-4 text-sm font-medium transition-all',
                  'text-prime-700 hover:text-prime-900 hover:bg-neutral-200',
                  'dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100'
                )}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition-all',
                'bg-cta-300 text-secondary-100 hover:bg-[#4ba1f0] active:bg-[#257cc0]'
              )}
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition-all',
        active
          ? 'bg-prime-900 text-secondary-100 dark:bg-prime-700 dark:text-secondary-100'
          : 'text-prime-700 hover:text-prime-900 dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100 hover:bg-neutral-200'
      )}
    >
      {label}
    </Link>
  );
}

// Figma LOGO: 동심원 boolean subtract 구조
// prime-900 + prime-500 + secondary-100(중앙 dot)
function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="#6983aa" />
      <circle cx="50" cy="50" r="45" fill="#1a222e" />
      <circle cx="50" cy="50" r="40" fill="#6983aa" />
      <circle cx="50" cy="50" r="35" fill="#1a222e" />
      <circle cx="50" cy="50" r="30" fill="#6983aa" />
      <circle cx="50" cy="50" r="25" fill="#1a222e" />
      <circle cx="50" cy="50" r="20" fill="#6983aa" />
      <circle cx="50" cy="50" r="15" fill="#1a222e" />
      <circle cx="50" cy="50" r="10" fill="#f8fafc" />
    </svg>
  );
}
