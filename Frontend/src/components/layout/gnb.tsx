'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, Bell, Mic, Globe, HelpCircle, LogOut, Info } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';
import { LogoSmall } from '../login';
import { UserProfileModal } from '../common/UserProfileModal';
import { Switch } from '@/components/ui';

// Figma: GNB (1738:4600)
// 1440x80
// Light mode: bg secondary-100 (#f8fafc) — 흰색
// Dark mode:  bg prime-900 (#1a222e)     — 네이비

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
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 w-full border-b border-transparent bg-transparent'
      )}
    >
      <nav className="layout-container flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
        {/* 로고 영역 — Figma: LogoSmall(80×80) + 텍스트(cta-300, 32px) */}
        <Link href="/" className="flex shrink-0 items-center gap-2 lg:w-60">
          <LogoSmall className="h-10 w-10 lg:h-20 lg:w-20" />
          <span className="text-cta-300 whitespace-nowrap text-xl leading-[1.3] font-semibold tracking-[-0.48px] lg:text-[32px]">
            마인드 로그
          </span>
        </Link>

        {/* 데스크톱 메뉴 — Figma: 각 버튼 98×44, rounded-full, gap 16px */}
        <div className="hidden items-center gap-4 lg:flex">
          {(isAuthenticated ? MEMBER_NAV_ITEMS : GUEST_NAV_ITEMS).map(({ label, href }) => (
            <NavItem key={href} label={label} href={href} active={pathname === href} />
          ))}

          {isAuthenticated ? (
            <>
              {/* 크레딧 버튼 — Figma 1738:4579: CreditButton */}
              <Link
                href="/shop"
                className="flex h-11 flex-col items-center justify-center gap-0.5 rounded-full px-3 text-base font-medium transition-colors hover:bg-neutral-200"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-cta-300 font-semibold">{user?.creditBalance ?? 0}</span>
                  <span className="text-prime-700">크레딧</span>
                  <Info size={16} className="text-prime-400" />
                </span>
                <span className="block h-0.75 w-0 rounded-full" />
              </Link>

              {/* 유저 이름 버튼 — Figma 1738:4383: UserButton */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className={cn(
                    'inline-flex h-11 max-w-24.5 items-center justify-center rounded-full px-3 text-base font-medium transition-all',
                    'text-cta-300 dark:hover:bg-prime-800 opacity-70 hover:bg-neutral-200 hover:opacity-100'
                  )}
                >
                  <span className="truncate">{user?.name ?? 'MY'}</span>
                </button>

                {profileDropdownOpen && (
                  <ProfileDropdown
                    userName={user?.name ?? ''}
                    onLogout={() => { setProfileDropdownOpen(false); handleLogout(); }}
                    onProfileSettings={() => { setProfileDropdownOpen(false); setProfileModalOpen(true); }}
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
            /* 로그인 버튼 — Figma 1738:4381: LogInOutButton */
            <Link
              href="/login"
              className={cn(
                'inline-flex h-11 w-24.5 items-center justify-center rounded-full text-base font-medium transition-all',
                'text-prime-700 hover:text-prime-900 dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100 hover:bg-neutral-200'
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
        <div className="bg-white dark:bg-prime-900 fixed inset-0 top-16 z-50 flex flex-col overflow-y-auto lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {(isAuthenticated ? MEMBER_NAV_ITEMS : GUEST_NAV_ITEMS).map(({ label, href }) => (
              <MobileNavItem key={href} label={label} href={href} active={pathname === href} />
            ))}

            {isAuthenticated ? (
              <>
                <MobileNavItem label="마이페이지" href="/my" active={pathname === '/my'} />
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
        'flex h-11 flex-col items-center justify-center gap-0.5 rounded-full px-3 text-base font-medium transition-all',
        active
          ? 'text-prime-900 dark:text-secondary-100'
          : 'text-prime-700 hover:text-prime-900 dark:text-tertiary-300 dark:hover:bg-prime-800 dark:hover:text-secondary-100 hover:bg-neutral-200'
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

// ── ProfileDropdown — Figma node 1673:3947 ──────────────────────────────────
function ProfileDropdown({
  userName,
  onLogout,
  onProfileSettings,
}: {
  userName: string;
  onLogout: () => void;
  onProfileSettings: () => void;
}) {
  const [alarmOff, setAlarmOff] = useState(true);
  const [voiceChat, setVoiceChat] = useState(true);

  return (
    <div className="bg-white dark:bg-prime-900 absolute top-full right-0 z-50 mt-1 w-[217px] overflow-hidden rounded-[4px] shadow-lg">
      {/* 인사말 — Figma: greeting, glass blue-10 bg */}
      <div className="flex items-center gap-2 bg-[rgba(130,201,255,0.1)] px-2 py-2">
        <User size={24} className="text-tertiary-500 dark:text-tertiary-300 shrink-0" />
        <p className="button-1 flex flex-col leading-snug">
          <span className="text-tertiary-500 dark:text-tertiary-300">안녕하세요,</span>
          <span>
            <span className="text-cta-300">{userName}</span>
            <span className="text-tertiary-500 dark:text-tertiary-300">님</span>
          </span>
        </p>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex flex-col px-2">
        {/* 프로필 설정 */}
        <button
          type="button"
          onClick={onProfileSettings}
          className="border-t-tertiary-400/30 dark:border-t-prime-700 dark:hover:bg-prime-800 flex w-full cursor-pointer items-center gap-2 rounded-sm border-t px-1 py-2 transition-colors hover:bg-neutral-100"
        >
          <User size={24} className="text-tertiary-500 dark:text-tertiary-300 shrink-0" />
          <span className="button-1 text-tertiary-500 dark:text-tertiary-300">프로필 설정</span>
        </button>

        {/* 알람 끄기 */}
        <div className="dark:hover:bg-prime-800 flex cursor-default items-center justify-between rounded-sm px-1 py-2 transition-colors hover:bg-neutral-100">
          <div className="flex items-center gap-2">
            <Bell size={24} className="text-tertiary-500 dark:text-tertiary-300 shrink-0" />
            <span className="button-1 text-tertiary-500 dark:text-tertiary-300">알람 끄기</span>
          </div>
          <Switch checked={alarmOff} onCheckedChange={setAlarmOff} />
        </div>

        {/* 음성 채팅 */}
        <div className="dark:hover:bg-prime-800 flex cursor-default items-center justify-between rounded-sm px-1 py-2 transition-colors hover:bg-neutral-100">
          <div className="flex items-center gap-2">
            <Mic size={24} className="text-tertiary-500 dark:text-tertiary-300 shrink-0" />
            <span className="button-1 text-tertiary-500 dark:text-tertiary-300">음성 채팅</span>
          </div>
          <Switch checked={voiceChat} onCheckedChange={setVoiceChat} />
        </div>

        {/* 언어 설정 */}
        <div className="dark:hover:bg-prime-800 flex cursor-default items-center justify-between rounded-sm px-1 py-2 transition-colors hover:bg-neutral-100">
          <div className="flex items-center gap-2">
            <Globe size={24} className="text-tertiary-500 dark:text-tertiary-300 shrink-0" />
            <span className="button-1 text-tertiary-500 dark:text-tertiary-300">언어 설정</span>
          </div>
          <span className="subtitle-2 text-tertiary-500 dark:text-tertiary-300">한국어</span>
        </div>

        {/* 고객 지원 */}
        <div className="flex cursor-default items-center gap-2 rounded-sm border-b border-b-tertiary-400/30 px-1 py-2 dark:border-b-prime-700">
          <HelpCircle size={24} className="shrink-0 text-tertiary-500 dark:text-tertiary-300" />
          <span className="button-1 text-tertiary-500 dark:text-tertiary-300">고객 지원</span>
        </div>

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={onLogout}
          className="dark:hover:bg-prime-800 flex w-full cursor-pointer items-center gap-2 rounded-sm px-1 py-2 transition-colors hover:bg-neutral-100"
        >
          <LogOut size={24} className="text-tertiary-500 dark:text-tertiary-300 shrink-0" />
          <span className="button-1 text-tertiary-500 dark:text-tertiary-300">로그아웃</span>
        </button>
      </div>
    </div>
  );
}
