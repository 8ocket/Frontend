import React from 'react';

export type ShopTabType = 'credit' | 'persona' | 'event';

interface ShopTabsProps {
  activeTab: ShopTabType;
  onTabChange: (tab: ShopTabType) => void;
}

/**
 * Shop 페이지 탭 네비게이션
 * Figma: 1738:4911, 1738:4912
 *
 * 스펙:
 * - Border: cta-300, 1px
 * - 높이: 44px (h-11)
 * - Radius: MD (rounded-md, 8px)
 * - 탭 간격: 16px (gap-4)
 * - 탭 패딩: 10px (p-2.5)
 * - 탭 너비: 140px (w-[140px])
 *
 * Active 상태: bg-interactive/glass/blue-50 (rgba(130,201,255,0.5))
 * Inactive 상태: text-prime-500
 */
export function ShopTabs({ activeTab, onTabChange }: ShopTabsProps) {
  const tabs: Array<{ id: ShopTabType; label: string }> = [
    { id: 'credit', label: '크레딧 구매하기' },
    { id: 'persona', label: '페르소나 해금하기' },
    { id: 'event', label: '이벤트' },
  ];

  return (
    <div
      className="border-cta-300 dark:border-cta-400 flex h-11 items-center justify-center overflow-clip rounded-md border"
      role="tablist"
    >
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
            className={`flex h-9 w-[140px] items-center justify-center rounded-md p-2.5 text-base font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-cta-300 bg-opacity-50 text-prime-900 dark:bg-opacity-50 dark:text-prime-900'
                : 'text-prime-500 dark:text-prime-400 hover:text-prime-600 dark:hover:text-prime-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
