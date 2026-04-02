'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import FaqItem from './FaqItem';
import { FAQ_ITEMS } from './faqData';

export default function SupportPage() {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <div className="min-h-main-safe bg-linear-to-b from-secondary-100 to-white">
      <main className="layout-container px-gutter mx-auto max-w-6xl pt-20 pb-32 sm:pt-28">
        <div className="mb-14 sm:mb-20">
          <h1 className="text-prime-900 mb-3 text-[28px] leading-tight font-bold tracking-tight sm:text-[36px]">
            고객지원
          </h1>
          <p className="text-prime-500 text-[15px] leading-relaxed sm:text-[16px]">
            도움이 필요하신가요? <br className="sm:hidden" />
            자주 묻는 질문들을 통해 빠르게 해결 방법을 찾아보세요.
          </p>
        </div>

        <div className="border-prime-100 overflow-hidden rounded-2xl border bg-white shadow-sm">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openIds.has(item.id)}
              onToggle={() => toggle(item.id)}
              isLast={index === FAQ_ITEMS.length - 1}
            />
          ))}
        </div>

        <div className="mt-20 text-center sm:mt-28">
          <p className="text-prime-500 mb-5 text-[14px] sm:text-[15px]">
            원하시는 답변을 찾지 못하셨나요?
          </p>
          <Button variant="secondary" size="default" className="rounded-full px-7 shadow-sm sm:text-[15px]">
            1:1 문의하기
          </Button>
        </div>
      </main>
    </div>
  );
}
