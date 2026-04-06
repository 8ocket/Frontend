import Link from 'next/link';

const FOOTER_LINKS = [
  { label: '개인정보처리방침', href: '/terms/personalInfo' },
  { label: '이용약관', href: '/terms/serviceTerm' },
  { label: 'AI 이용 안내', href: '/terms/aiServiceTerm' },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#eee] bg-[#fafafa] pb-10 pt-3">
      <div className="mx-auto flex max-w-360 flex-col gap-y-2 px-8 sm:px-12 md:flex-row md:items-center md:justify-between">
        {/* 약관 링크 */}
        <nav className="flex flex-wrap items-center gap-y-1">
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center">
              <Link
                href={link.href}
                className="px-1.5 py-1 text-[12px] text-[#aaa] transition-colors hover:text-[#555] hover:underline"
              >
                {link.label}
              </Link>
              {i < FOOTER_LINKS.length - 1 && (
                <span className="select-none text-[12px] text-[#ccc]" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </nav>

        {/* 저작권 */}
        <p className="pl-1.5 text-[12px] text-[#bbb] md:pl-0">
          © 2026 마인드 로그 (MindLog). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
