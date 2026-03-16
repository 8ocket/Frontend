'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';
import { LogoSmall } from '../login';

// Figma: GNB (1738:4600)
// 1440x80
// Light mode: bg secondary-100 (#f8fafc) — 흰색
// Dark mode:  bg prime-900 (#1a222e)     — 네이비

const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: 'AI 상담', href: '/chat' },
  { label: '브랜드 소개', href: '/about' },
  { label: '마음기록 모음', href: '/collection' },
  { label: '심화 리포트', href: '/report' },
  { label: '상점', href: '/shop' },
] as const;

const NO_GNB_PATHS = ['/login', '/signup', '/signup/nickname', '/auth/callback'];

export function GNB() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 경로 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // 모바일 메뉴 열림 시 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (NO_GNB_PATHS.includes(pathname)) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-secondary-100 dark:bg-prime-900 dark:border-prime-800 w-full border-b border-neutral-200">
      <nav className="layout-container flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
        {/* 로고 영역 — Figma: LogoSmall(80×80) + 텍스트(cta-300, 32px) */}
        <Link href="/" className="flex shrink-0 items-center gap-2 md:w-60">
          <LogoSmall className="h-10 w-10 md:h-20 md:w-20" />
          <span className="text-cta-300 text-xl leading-[1.3] font-semibold tracking-[-0.48px] md:text-[32px]">
            마인드 로그
          </span>
        </Link>

        {/* 데스크톱 메뉴 — Figma: 각 버튼 98×44, rounded-full, gap 16px */}
        <div className="hidden items-center gap-4 lg:flex">
          {NAV_ITEMS.map(({ label, href }) => (
            <NavItem key={href} label={label} href={href} active={pathname === href} />
          ))}

          {isAuthenticated ? (
            <>
              {/* 크레딧 버튼 — Figma 1738:4382: CreditButton */}
              <Link
                href="/credit"
                className={cn(
                  'inline-flex h-11 items-center gap-1 rounded-full px-3 text-base font-medium transition-all',
                  'text-prime-700 hover:bg-neutral-200 hover:text-prime-900 dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100'
                )}
              >
                <span className="text-info-500">크레딧</span>
                <Image src="/images/icons/credit.svg" alt="" width={20} height={20} />
              </Link>

              {/* 유저 이름 버튼 — Figma 1738:4383: UserButton */}
              <Link
                href="/my"
                className={cn(
                  'inline-flex h-11 w-24.5 items-center justify-center rounded-full text-base font-medium transition-all',
                  'text-cta-300 opacity-70 hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-prime-800'
                )}
              >
                {user?.name ?? 'MY'}
              </Link>
            </>
          ) : (
            /* 로그인 버튼 — Figma 1738:4381: LogInOutButton */
            <Link
              href="/login"
              className={cn(
                'inline-flex h-11 w-24.5 items-center justify-center rounded-full text-base font-medium transition-all',
                'text-prime-700 hover:bg-neutral-200 hover:text-prime-900 dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100'
              )}
            >
              로그인
            </Link>
          )}
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="dark:hover:bg-prime-800 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-neutral-200 lg:hidden"
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* 모바일 메뉴 오버레이 */}
      {mobileMenuOpen && (
        <div className="bg-secondary-100 dark:bg-prime-900 fixed inset-0 top-16 z-50 flex flex-col overflow-y-auto lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV_ITEMS.map(({ label, href }) => (
              <MobileNavItem key={href} label={label} href={href} active={pathname === href} />
            ))}

            {isAuthenticated ? (
              <>
                <MobileNavItem label="마이페이지" href="/my" active={pathname === '/my'} />
                <MobileNavItem label="고객지원" href="/credit" active={pathname === '/credit'} />
                <div className="dark:border-prime-700 my-2 border-t border-neutral-200" />
                <button
                  onClick={handleLogout}
                  className={cn(
                    'w-full rounded-xl px-4 py-3 text-left text-base font-medium transition-all',
                    'text-error-500 hover:bg-error-100 dark:hover:bg-prime-800'
                  )}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <div className="dark:border-prime-700 my-2 border-t border-neutral-200" />
                <Link
                  href="/login"
                  className="bg-cta-300 text-secondary-100 rounded-xl px-4 py-3 text-center text-base font-medium transition-all hover:bg-[#4ba1f0] active:bg-[#257cc0]"
                >
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// NavItem — Figma: 98×44, rounded-full, active = 하단 3px 언더라인 바
function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex h-11 w-24.5 flex-col items-center justify-center gap-0.5 rounded-full text-base font-medium transition-all',
        active
          ? 'text-prime-900 dark:text-secondary-100'
          : 'text-prime-700 hover:bg-neutral-200 hover:text-prime-900 dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100'
      )}
    >
      {label}
      <span
        className={cn(
          'block h-0.75 rounded-full bg-current transition-all duration-200',
          active ? 'w-7' : 'w-0'
        )}
      />
    </Link>
  );
}

function MobileNavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-xl px-4 py-3 text-base font-medium transition-all',
        active
          ? 'bg-prime-900 text-secondary-100 dark:bg-prime-700 dark:text-secondary-100'
          : 'text-prime-700 hover:text-prime-900 dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100 hover:bg-neutral-100'
      )}
    >
      {label}
    </Link>
  );
}
