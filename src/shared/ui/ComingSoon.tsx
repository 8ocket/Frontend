'use client';

import Link from 'next/link';

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="bg-cta-300/10 text-cta-300 rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide">
          Coming Soon
        </span>
        <h1 className="text-prime-900 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="text-prime-500 max-w-sm text-base leading-relaxed">
          현재 준비 중인 페이지입니다.
          <br />
          곧 더 나은 서비스로 찾아뵙겠습니다.
        </p>
      </div>
      <Link
        href="/"
        className="bg-cta-300 text-white hover:bg-cta-400 rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
