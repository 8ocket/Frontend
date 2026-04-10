'use client';

import { useMemo, useState } from 'react';
import FaqItem from './FaqItem';
import { FAQ_CATEGORIES } from './faqData';

const ALL_LABEL = '전체';
const CATEGORY_LABELS = [ALL_LABEL, ...FAQ_CATEGORIES.map((c) => c.label)];

export default function SupportPage() {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState(ALL_LABEL);

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

  const filteredItems = useMemo(() => {
    if (activeFilter === ALL_LABEL) {
      return FAQ_CATEGORIES.flatMap((c) => c.items);
    }
    return FAQ_CATEGORIES.find((c) => c.label === activeFilter)?.items ?? [];
  }, [activeFilter]);

  const handleFilterChange = (label: string) => {
    setActiveFilter(label);
    setOpenIds(new Set());
  };

  return (
    <div className="min-h-main-safe from-secondary-100 bg-linear-to-b to-white">
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

        <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
          {CATEGORY_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handleFilterChange(label)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all sm:text-[14px] ${
                activeFilter === label
                  ? 'bg-cta-600 text-white shadow-sm'
                  : 'text-prime-600 border-prime-200 hover:border-cta-300 hover:text-cta-600 border bg-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredItems.map((item) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openIds.has(item.id)}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
