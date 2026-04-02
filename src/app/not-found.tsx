import Link from 'next/link';
import { Home, MessageCircleWarning } from 'lucide-react';

import { Button } from '@/shared/ui/button';

export default function NotFound() {
  return (
    <main className="from-secondary-100 to-prime-100/70 min-h-screen-safe relative flex items-center overflow-hidden bg-gradient-to-br via-[#eef5fb] px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-cta-200/45 absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-prime-300/35 absolute right-0 bottom-0 h-80 w-80 translate-x-1/4 rounded-full blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-3xl flex-col items-center overflow-hidden rounded-[32px] border border-white/80 bg-white/92 px-6 py-12 text-center shadow-[0_24px_80px_rgba(17,22,30,0.1)] backdrop-blur sm:px-10 sm:py-16">
        <div className="from-cta-100 to-prime-100 text-prime-800 mb-6 flex size-18 items-center justify-center rounded-full bg-gradient-to-br shadow-inner shadow-white">
          <MessageCircleWarning className="size-9" strokeWidth={1.75} aria-hidden="true" />
        </div>

        <p className="card-02 text-prime-500 mb-3">Page Not Found</p>
        <h1 className="text-prime-800 mb-4 text-[4.5rem] leading-none font-semibold tracking-[-0.06em] sm:text-[6rem]">
          404
        </h1>
        <h2 className="text-prime-900 mb-4 text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.03em] sm:text-[2.25rem]">
          찾으시는 페이지를 찾지 못했어요.
        </h2>
        <p className="text-prime-600 max-w-2xl text-sm leading-6 sm:text-base">
          입력하신 주소가 잘못되었거나, 페이지가 이동 또는 삭제되었을 수 있습니다.
        </p>
        <p className="text-prime-600 mb-8 max-w-2xl text-sm leading-6 sm:text-base">
          아래 버튼을 통해 MindLog 홈으로 이동해 다시 이용해 보세요.
        </p>

        <div className="mb-10 flex w-full max-w-md flex-col gap-3">
          <Button asChild size="cta">
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              MIND-LOG 홈으로 가기
            </Link>
          </Button>
        </div>

        <div className="bg-secondary-100/85 border-prime-100/80 w-full max-w-2xl rounded-[28px] border px-5 py-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-7">
          <h3 className="text-prime-900 mb-4 text-xl leading-[1.3] font-semibold tracking-[-0.03em]">
            도움이 필요하신가요?
          </h3>
          <div className="text-prime-700 space-y-3 text-sm leading-6 sm:text-base">
            <p>
              <span className="font-semibold">(1) 주소 다시 확인:</span> 주소창에 입력한 내용이
              맞는지 한 번 더 확인해 주세요.
            </p>
            <p>
              <span className="font-semibold">(2) 문의하기:</span> 같은 문제가 계속된다면{' '}
              <Link
                href="/support"
                className="text-cta-700 hover:text-cta-800 font-semibold underline underline-offset-4 transition-colors"
              >
                문의하기
              </Link>
              를 통해 편하게 알려주세요.
            </p>
          </div>
          <p className="text-prime-500 mt-6 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs tracking-[0.02em] sm:text-sm">
            [ Error Code: 404 (Not Found) ]
          </p>
        </div>
      </section>
    </main>
  );
}
