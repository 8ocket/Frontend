'use client';

import { ChatLogo } from '@/widgets/chat-main-area';

// Figma 1363:2926 — 첫 화면시
// 1440×80, fill secondary-100 (#f8fafc)
// Frame 13: HORIZONTAL, gap 268, mainAxis CENTER, cross CENTER
//   로고 (220×80) + 메뉴 (952×80, HORIZONTAL gap 24)

// 메뉴 아이템: 98×44, VERTICAL, pad 10, radius 22, Medium 16px, prime-900
// 밑줄 Rectangle: h=3, fill #d9d9d9 (너비는 텍스트 길이에 비례)

type NavItem = {
  id: string;
  label: string;
  href: string;
  underlineWidth: number; // Figma Rectangle 49 width (px)
};

// Figma 1363:2931~2952
const NAV_ITEMS: NavItem[] = [
  { id: 'home',    label: '홈',       href: '/',       underlineWidth: 12 },
  { id: 'chat',    label: 'AI 상담',  href: '/chat',   underlineWidth: 48 },
  { id: 'about',   label: '브랜드 소개', href: '/about', underlineWidth: 72 },
  { id: 'report',  label: '전문 리포트', href: '/report', underlineWidth: 62 },
  { id: 'diary',   label: '마음기록', href: '/my',     underlineWidth: 24 },
  { id: 'support', label: '고객지원', href: '/support', underlineWidth: 48 },
  { id: 'shop',    label: '상점',     href: '/shop',   underlineWidth: 24 },
  { id: 'logout',  label: '로그아웃', href: '/logout', underlineWidth: 56 },
];

type ChatWelcomeHeaderProps = {
  activeId?: string;
};

export function ChatWelcomeHeader({ activeId }: ChatWelcomeHeaderProps) {
  return (
    // Root — 1440×80, bg secondary-100
    <header className="bg-secondary-100 flex h-20 w-full items-center justify-center">
      {/* Frame 13 — HORIZONTAL, gap 268, mainAxis CENTER, cross CENTER */}
      <div className="flex flex-row items-center gap-67">
        {/* 로고 — 1363:2928, 220×80 / Subtract 2 — Figma 1382:2757 */}
        <div className="bg-secondary-100 flex h-20 w-55 items-center">
          <ChatLogo size={80} />
        </div>

        {/* 메뉴 — 1363:2930, 952×80, HORIZONTAL gap 24, cross CENTER */}
        <nav className="flex h-20 flex-row items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              // 각 메뉴 아이템 — 98×44, VERTICAL, pad 10, radius 22
              <a
                key={item.id}
                href={item.href}
                className={[
                  'flex h-11 w-24.5 flex-col items-center justify-start rounded-[22px] px-2.5 pt-2.5',
                  isActive ? 'bg-secondary-100' : '',
                ].join(' ')}
              >
                {/* TODO: 타이포그래피 토큰으로 전환 → className="button-1 text-prime-900" */}
                <span
                  className="text-prime-900"
                  style={{
                    fontFamily: 'var(--font-pretendard)',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '100%',
                  }}
                >
                  {item.label}
                </span>
                {/* 밑줄 Rectangle 49 — h:3, fill #d9d9d9 */}
                <span
                  className="mt-auto block h-0.75 shrink-0"
                  style={{
                    width: item.underlineWidth + 'px',
                    backgroundColor: '#d9d9d9',
                  }}
                />
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
