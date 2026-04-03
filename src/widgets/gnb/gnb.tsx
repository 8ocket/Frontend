'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Coins } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/entities/user/store';
import { cn } from '@/shared/lib/utils';
import { UserProfileModal } from '@/shared/ui/UserProfileModal';
import { Button } from '@/shared/ui/button';
import { useCreditStore } from '@/entities/credits/store';

// Figma: GNB (1738:4600)
// 1440x80

const MEMBER_NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: 'AI 상담', href: '/chat' },
  { label: '마음기록 모음', href: '/collection' },
  { label: '심화 리포트', href: '/report' },
  { label: '상점', href: '/shop' },
  { label: '브랜드 소개', href: '/about' },
  { label: '고객 지원', href: '/support' },
] as const;

const GUEST_NAV_ITEMS = [
  { label: '브랜드 소개', href: '/about' },
  { label: '고객 지원', href: '/support' },
] as const;

export function GNB() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalCredit } = useCreditStore();
  const [scrollRatio, setScrollRatio] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  // 경로 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    startTransition(() => {
      setMobileMenuOpen(false);
    });
  }, [pathname]);

  // 스크롤 감지 — 0~80px 구간을 0~1로 정규화
  useEffect(() => {
    const handleScroll = () => setScrollRatio(Math.min(window.scrollY / 80, 1));
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 모바일 메뉴 열림 시 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header
      className="text-prime-900 fixed top-0 right-0 left-0 z-50 w-full backdrop-blur-md"
      style={
        pathname === '/about'
          ? {
              backgroundColor: `rgba(255,255,255,${scrollRatio * 0.6})`,
              boxShadow: `0 4px 30px rgba(0,0,0,${scrollRatio * 0.03})`,
            }
          : {
              backgroundColor: `rgba(255,255,255,${0.6 + scrollRatio * 0.3})`,
              boxShadow:
                scrollRatio > 0
                  ? `0 4px 30px rgba(0,0,0,${scrollRatio * 0.08})`
                  : '0 1px 0 rgba(0,0,0,0.06)',
            }
      }
    >
      <nav className="layout-container px-gutter flex h-16 items-center justify-between md:h-20">
        {/* 로고 */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="relative size-8 overflow-hidden rounded-full">
            <Image
              src="/images/logo/logo-small.svg"
              alt="MindLog"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-prime-900 text-lg leading-6.75 font-normal tracking-[-0.27px] whitespace-nowrap">
            마인드 로그
          </span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden items-center gap-1 lg:flex">
          {(isAuthenticated ? MEMBER_NAV_ITEMS : GUEST_NAV_ITEMS).map(({ label, href }) => (
            <NavItem key={href} label={label} href={href} active={pathname === href} />
          ))}
        </div>

        {/* 우측 유틸리티 영역 */}
        <div className="hidden lg:flex">
          {isAuthenticated ? (
            // 크레딧 + 프로필 — 하나의 그룹으로 묶어 시각 분리
            <div className="border-prime-100 flex items-center gap-3 rounded-full border bg-white/70 px-4 py-1.5">
              {/* 크레딧 */}
              <Link
                href="/shop?tab=credit"
                className="text-prime-600 hover:text-prime-900 flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <div className="bg-interactive-glass-blue-50 flex size-6 items-center justify-center rounded-full">
                  <Coins size={13} strokeWidth={2} className="text-cta-300" />
                </div>
                {totalCredit.toLocaleString()} 크레딧
              </Link>

              {/* 구분선 */}
              <div className="bg-prime-100 h-4 w-px" />

              {/* 프로필 버튼 + 드롭다운 */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 transition-opacity hover:opacity-70"
                >
                  <div className="border-cta-300 bg-cta-100 relative size-7 shrink-0 overflow-hidden rounded-full border">
                    <Image
                      src={user?.profileImage ?? '/images/icons/profile-default.svg'}
                      alt="프로필"
                      fill
                      className={
                        user?.profileImage &&
                        user.profileImage !== '/images/icons/profile-default.svg'
                          ? 'object-cover'
                          : 'object-contain p-1'
                      }
                    />
                  </div>
                  <span className="text-prime-900 text-sm font-medium">{user?.name ?? 'MY'}</span>
                </button>

                {profileDropdownOpen && (
                  <ProfileDropdown
                    userName={user?.name ?? ''}
                    userProfileImage={user?.profileImage}
                    onLogout={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    onMypage={() => {
                      setProfileDropdownOpen(false);
                      router.push('/my');
                    }}
                    onProfileHeader={() => {
                      setProfileDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-prime-700 hover:text-prime-900 text-sm font-medium transition-colors"
            >
              로그인
            </Link>
          )}
        </div>

        <UserProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hover:bg-secondary-100 flex h-9 w-9 items-center justify-center rounded-lg transition-colors lg:hidden"
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* 모바일 메뉴 오버레이 */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-white lg:hidden md:top-20">
          <div className="flex flex-col gap-1 px-4 py-4">
            {(isAuthenticated ? MEMBER_NAV_ITEMS : GUEST_NAV_ITEMS).map(({ label, href }) => (
              <MobileNavItem key={href} label={label} href={href} active={pathname === href} />
            ))}

            {isAuthenticated ? (
              <>
                <MobileNavItem label="마이페이지" href="/my" active={pathname === '/my'} />
                <div className="border-prime-100 my-2 border-t" />
                <button
                  onClick={handleLogout}
                  className="text-error-500 hover:bg-error-100 w-full rounded-xl px-4 py-3 text-left text-base font-medium transition-all"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <div className="border-prime-100 my-2 border-t" />
                <Button asChild variant="primary" size="default" className="rounded-xl text-base">
                  <Link href="/login">로그인</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// NavItem — framer-motion 알약 hover 배경
function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex flex-col items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium tracking-[-0.21px] transition-colors',
        active ? 'text-prime-900' : 'text-prime-700 hover:text-prime-900'
      )}
    >
      <AnimatePresence>
        {hovered && !active && (
          <motion.div
            layoutId={`nav-hover-${href}`}
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
      <span
        className={cn(
          'relative z-10 block h-0.5 rounded-full transition-all duration-200',
          active ? 'bg-cta-300 w-full' : 'bg-prime-300 w-0'
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
        'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all',
        active ? 'text-prime-900' : 'text-prime-700 hover:text-prime-900'
      )}
    >
      {label}
      <span
        className={cn(
          'h-2 w-2 rounded-full transition-all',
          active ? 'bg-cta-300 opacity-100' : 'bg-prime-200 opacity-0'
        )}
      />
    </Link>
  );
}

// ── ProfileDropdown — Figma node 18:368 ─────────────────────────────────────
function ProfileDropdown({
  userName,
  userProfileImage,
  onLogout,
  onMypage,
  onProfileHeader,
}: {
  userName: string;
  userProfileImage?: string;
  onLogout: () => void;
  onMypage: () => void;
  onProfileHeader: () => void;
}) {
  const isDefaultImage =
    !userProfileImage || userProfileImage === '/images/icons/profile-default.svg';

  return (
    <div className="border-prime-100 absolute top-full right-0 z-50 mt-2 w-59.5 overflow-hidden rounded-2xl border bg-white/90 shadow-sm backdrop-blur-md">
      {/* 헤더: 아바타 + 이름 + 이메일 */}
      <button
        type="button"
        onClick={onProfileHeader}
        className="border-prime-100 hover:bg-secondary-50 flex w-full items-center gap-3 border-b px-5 py-4 transition-colors"
      >
        <div className="border-cta-300 bg-cta-100 relative size-10 shrink-0 overflow-hidden rounded-full border">
          <Image
            src={userProfileImage ?? '/images/icons/profile-default.svg'}
            alt="프로필"
            fill
            className={isDefaultImage ? 'object-contain p-1.5' : 'object-cover'}
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-prime-900 truncate text-sm leading-normal font-medium tracking-[-0.21px]">
            {userName}
          </span>
        </div>
      </button>

      {/* 메뉴 항목 */}
      <div className="py-2">
        <button
          type="button"
          onClick={onMypage}
          className="text-prime-900 hover:bg-secondary-50 flex w-full items-center gap-3 px-5 py-3 text-sm font-medium tracking-[-0.21px] transition-colors"
        >
          <div className="bg-interactive-glass-blue-50 flex size-8 shrink-0 items-center justify-center rounded-xl">
            <User size={15} className="text-cta-300" />
          </div>
          마이페이지
        </button>

        <div className="bg-prime-100 mx-3 my-1 h-px" />

        <button
          type="button"
          onClick={onLogout}
          className="text-error-500 hover:bg-error-100 flex w-full items-center gap-3 px-5 py-3 text-sm font-medium tracking-[-0.21px] transition-colors"
        >
          <div className="bg-error-100 flex size-8 shrink-0 items-center justify-center rounded-xl">
            <LogOut size={15} className="text-error-500" />
          </div>
          로그아웃
        </button>
      </div>
    </div>
  );
}
