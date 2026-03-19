import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export type ShopTabType = 'credit' | 'persona' | 'event';

interface ShopTabsProps {
  activeTab: ShopTabType;
  onTabChange: (tab: ShopTabType) => void;
  children?: React.ReactNode;
}

const TABS: Array<{ id: ShopTabType; label: string }> = [
  { id: 'credit', label: '크레딧 구매하기' },
  { id: 'persona', label: '페르소나 해금하기' },
  { id: 'event', label: '이벤트' },
];

/**
 * Shop 페이지 탭 네비게이션
 * Figma: 1738:4911, 1738:4912
 * 공통 Tabs 컴포넌트를 controlled 방식으로 래핑
 */
export function ShopTabs({ activeTab, onTabChange, children }: ShopTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as ShopTabType)}>
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabsContent as ShopTabsContent };
