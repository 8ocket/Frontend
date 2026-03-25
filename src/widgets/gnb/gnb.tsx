'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, Settings, LogOut, Coins } from 'lucide-react';
import { useAuthStore } from '@/entities/user/store';
import { cn } from '@/shared/lib/utils';
import { UserProfileModal } from '@/shared/ui/UserProfileModal';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 경로 변경 시 모바일 메뉴 닫기 (render 중 state 리셋 패턴)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

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
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-white/60 bg-white/80 backdrop-blur-md text-prime-900">
      <nav className="layout-container flex h-16 items-center justify-between px-10">
        {/* 로고 — Figma: 32px 원형 + 텍스트 18px */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="relative size-8 overflow-hidden rounded-full">
            <Image src="/images/logo/logo-small.svg" alt="MindLog" fill className="object-contain" />
          </div>
          <span className="whitespace-nowrap text-lg font-normal leading-6.75 tracking-[-0.27px] text-prime-900">
            마인드 로그
          </span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden items-center gap-6 lg:flex">
          {(isAuthenticated ? MEMBER_NAV_ITEMS : GUEST_NAV_ITEMS).map(({ label, href }) => (
            <NavItem key={href} label={label} href={href} active={pathname === href} />
          ))}
        </div>

        {/* 우측 영역 */}
        <div className="hidden items-center gap-6 lg:flex">
          {isAuthenticated ? (
            <>
              {/* 크레딧 */}
              <Link href="/shop" className="flex items-center gap-2 text-sm font-medium text-prime-600 transition-colors hover:text-prime-900">
                <div className="flex size-7 items-center justify-center rounded-full bg-blue-50">
                  <Coins size={14} strokeWidth={2} className="text-main-blue" />
                </div>
                {user?.creditBalance ?? 0} 크레딧
              </Link>

              {/* 프로필 버튼 (아이콘 + 이름) + 드롭다운 */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 transition-opacity hover:opacity-70"
                >
                  <div className="border-cta-300 relative size-8 shrink-0 overflow-hidden rounded-full border bg-blue-50">
                    <Image
                      src={user?.profileImage ?? '/images/icons/profile-default.svg'}
                      alt="프로필"
                      fill
                      className={user?.profileImage && user.profileImage !== '/images/icons/profile-default.svg' ? 'object-cover' : 'object-contain p-1'}
                    />
                  </div>
                  <span className="text-sm font-medium text-prime-900">
                    {user?.name ?? 'MY'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <ProfileDropdown
                    userName={user?.name ?? ''}
                    userEmail={user?.email ?? ''}
                    userProfileImage={user?.profileImage}
                    onLogout={() => { setProfileDropdownOpen(false); handleLogout(); }}
                    onProfile={() => { setProfileDropdownOpen(false); setProfileModalOpen(true); }}
                    onSettings={() => { setProfileDropdownOpen(false); router.push('/my'); }}
                  />
                )}
              </div>

              <UserProfileModal
                isOpen={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                userName={user?.name ?? ''}
              />
            </>
          ) : (
            <Link href="/login" className="text-prime-700 text-sm font-medium transition-colors hover:text-prime-900">
              로그인
            </Link>
          )}
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-neutral-200 lg:hidden"
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* 모바일 메뉴 오버레이 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col overflow-y-auto bg-white lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {(isAuthenticated ? MEMBER_NAV_ITEMS : GUEST_NAV_ITEMS).map(({ label, href }) => (
              <MobileNavItem key={href} label={label} href={href} active={pathname === href} />
            ))}

            {isAuthenticated ? (
              <>
                <MobileNavItem label="마이페이지" href="/my" active={pathname === '/my'} />
                <div className="my-2 border-t border-neutral-200" />
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-3 text-left text-base font-medium text-error-500 transition-all hover:bg-error-100"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-neutral-200" />
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

// NavItem — Figma: 98×44, active = 하단 언더라인 바
function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center gap-0.5 text-sm font-medium tracking-[-0.21px] transition-colors',
        active ? 'text-prime-900' : 'text-prime-900/70 hover:text-prime-900'
      )}
    >
      {label}
      <span
        className={cn(
          'block h-0.5 rounded-full bg-current transition-all duration-200',
          active ? 'w-full' : 'w-0'
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
          ? 'bg-prime-900 text-secondary-100'
          : 'text-prime-700 hover:bg-neutral-100 hover:text-prime-900'
      )}
    >
      {label}
    </Link>
  );
}

// ── ProfileDropdown — Figma node 18:368 ─────────────────────────────────────
function ProfileDropdown({
  userName,
  userEmail,
  userProfileImage,
  onLogout,
  onProfile,
  onSettings,
}: {
  userName: string;
  userEmail: string;
  userProfileImage?: string;
  onLogout: () => void;
  onProfile: () => void;
  onSettings: () => void;
}) {
  const isDefaultImage = !userProfileImage || userProfileImage === '/images/icons/profile-default.svg';

  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-[238px] overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] backdrop-blur-md">
      {/* 헤더: 아바타 + 이름 + 이메일 */}
      <div className="flex items-center gap-3 border-b border-white/60 px-5 py-4">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-cta-300 bg-blue-50">
          <Image
            src={userProfileImage ?? '/images/icons/profile-default.svg'}
            alt="프로필"
            fill
            className={isDefaultImage ? 'object-contain p-1.5' : 'object-cover'}
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium leading-[1.5] tracking-[-0.21px] text-prime-900">
            {userName}
          </span>
          <span className="truncate text-xs leading-[1.5] tracking-[-0.18px] text-prime-500">
            {userEmail}
          </span>
        </div>
      </div>

      {/* 메뉴 항목 */}
      <div className="py-2">
        {/* 내 프로필 */}
        <button
          type="button"
          onClick={onProfile}
          className="flex w-full items-center gap-4 px-5 py-3 text-sm font-medium tracking-[-0.21px] text-prime-900 transition-colors hover:bg-black/5"
        >
          <User size={18} className="shrink-0 text-prime-500" />
          내 프로필
        </button>

        {/* 설정 */}
        <button
          type="button"
          onClick={onSettings}
          className="flex w-full items-center gap-4 px-5 py-3 text-sm font-medium tracking-[-0.21px] text-prime-900 transition-colors hover:bg-black/5"
        >
          <Settings size={18} className="shrink-0 text-prime-500" />
          설정
        </button>

        {/* 구분선 */}
        <div className="mx-3 my-1 h-px bg-white/60" />

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-4 px-5 py-3 text-sm font-medium tracking-[-0.21px] text-error-500 transition-colors hover:bg-black/5"
        >
          <LogOut size={18} className="shrink-0 text-error-500" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
