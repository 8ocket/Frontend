'use client';

import Link from 'next/link';
import { TERMS_LIST } from '@/shared/constants/terms';

export function Footer() {
  return (
    <footer className="bg-[rgba(130,201,255,0.1)] text-center">
      <div className="mx-auto max-w-360 px-12 py-10">
        {/* 약관 링크 */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {TERMS_LIST.map((term) => (
            <Link
              key={term.key}
              href={`/terms/${term.key}`}
              className="text-prime-700/60 hover:text-cta-300 text-[12px] font-medium transition-colors"
            >
              {term.label}
            </Link>
          ))}
        </div>

        {/* 법적 고지 + 저작권 */}
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-prime-700/50 text-[12px] leading-[1.5] font-medium">
            본 서비스의 상담 내용은 암호화되어 안전하게 보호됩니다. © 2026 마인드 로그 (MindLog).
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
