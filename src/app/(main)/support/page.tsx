'use client';

import { useState } from 'react';
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
    <div className="min-h-main-safe bg-linear-to-b from-slate-50/50 to-white">
      <main className="mx-auto max-w-6xl px-5 pt-20 pb-32 sm:px-6 sm:pt-28">
        <div className="mb-14 sm:mb-20">
          <h1 className="mb-3 text-[28px] leading-tight font-bold tracking-tight text-[#0F172A] sm:text-[36px]">
            고객지원
          </h1>
          <p className="text-[15px] leading-relaxed text-[#64748B] sm:text-[16px]">
            도움이 필요하신가요? <br className="sm:hidden" />
            자주 묻는 질문들을 통해 빠르게 해결 방법을 찾아보세요.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
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
          <p className="mb-5 text-[14px] text-[#64748B] sm:text-[15px]">
            원하시는 답변을 찾지 못하셨나요?
          </p>
          <button className="rounded-full border-2 border-slate-200 bg-white px-7 py-3 text-[14px] font-semibold text-neutral-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none active:translate-y-0 sm:text-[15px]">
            1:1 문의하기
          </button>
        </div>
      </main>
    </div>
  );
}
