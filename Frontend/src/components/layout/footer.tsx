'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoSmall } from '../login';

const NO_FOOTER_PATHS = ['/chat'];

const FOOTER_NAV = [
  { label: '홈', href: '/', items: [] },
  { label: 'AI 상담', href: '/chat', items: [] },
  { label: '브랜드 소개', href: '/about', items: [] },
  {
    label: '마음기록 모음',
    href: '/collection',
    items: [{ label: '오로라 감정카드', href: '/collection' }],
  },
  {
    label: '심화 리포트',
    href: '/report',
    items: [
      { label: '주간 리포트', href: '/report' },
      { label: '월간 리포트', href: '/report' },
    ],
  },
  {
    label: '상점',
    href: '/shop',
    items: [
      { label: '크레딧 구매', href: '/shop' },
      { label: '페르소나 구매', href: '/shop' },
      { label: '이벤트', href: '/shop' },
    ],
  },
  {
    label: '고객지원',
    href: '#',
    items: [
      { label: '자주 묻는 질문', href: '#' },
      { label: '결제 관련 문의', href: '#' },
      { label: 'AI 상담 문의', href: '#' },
      { label: '기타 오류', href: '#' },
      { label: '연락처', href: '#' },
      { label: '회원 탈퇴', href: '#' },
    ],
  },
  { label: '계정관리', href: '/my', items: [] },
];

export function Footer() {
  const pathname = usePathname();
  if (NO_FOOTER_PATHS.includes(pathname)) return null;

  return (
    <footer className="mt-37.5 bg-[rgba(130,201,255,0.1)]">
      <div className="mx-auto max-w-360 px-12 py-8">
        {/* 로고 + 내비게이션 */}
        <div className="flex items-start gap-4">
          <LogoSmall className="h-20 w-20 shrink-0" />
          <nav className="flex flex-1 justify-between">
            {FOOTER_NAV.map(({ label, href, items }) => (
              <div key={label} className="flex flex-col gap-3.75">
                <Link
                  href={href}
                  className="text-[16px] font-semibold leading-[1.3] tracking-[-0.24px] text-[#1a222e] transition-colors hover:text-cta-300"
                >
                  {label}
                </Link>
                {items.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    className="text-[14px] font-normal leading-[1.6] text-prime-700 transition-colors hover:text-cta-300"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* 법적 고지 + 저작권 */}
        <div className="mt-10 flex flex-col gap-2">
          <p className="text-[12px] font-medium leading-[1.2] tracking-[-0.18px] text-[#1a222e]">
            본 서비스는 전문 심리 상담 이론(인지행동치료 등)을 바탕으로 설계되었습니다. 사용자의 모든 대화는 암호화되어 안전하게 보관됩니다
          </p>
          <p className="text-[12px] font-medium leading-[1.2] tracking-[-0.18px] text-[#1a222e]">
            All rights reserved by 마인드 로그(Mind-Log)©
          </p>
        </div>
      </div>
    </footer>
  );
}
