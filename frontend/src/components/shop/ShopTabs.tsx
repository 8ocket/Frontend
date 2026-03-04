import React from 'react';

export type ShopTabType = 'credit' | 'persona' | 'event';

interface ShopTabsProps {
  activeTab: ShopTabType;
  onTabChange: (tab: ShopTabType) => void;
}

/**
 * Shop 페이지 탭 네비게이션
 * Figma: 1738:4911, 1738:4912
 */
export function ShopTabs({ activeTab, onTabChange }: ShopTabsProps) {
  const tabs: Array<{ id: ShopTabType; label: string }> = [
    { id: 'credit', label: '크레딧 구매하기' },
    { id: 'persona', label: '페르소나 해금하기' },
    { id: 'event', label: '이벤트' },
  ];

  return (
    <div className="border-cta-300 dark:border-cta-400 flex items-start justify-center rounded-lg border">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center px-2.5 py-2.5 transition-all ${
              activeTab === tab.id
                ? 'bg-cta-300 bg-opacity-50 text-prime-900 dark:bg-cta-300 dark:bg-opacity-50 dark:text-prime-900 rounded-lg'
                : 'text-prime-500 hover:text-prime-600 dark:text-prime-400 dark:hover:text-prime-300'
            }`}
          >
            <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
