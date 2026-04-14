import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';

export type ShopTabType = 'credit' | 'persona' | 'event';

interface ShopTabsProps {
  readonly activeTab: ShopTabType;
  readonly onTabChange: (tab: ShopTabType) => void;
  readonly children?: React.ReactNode;
}

const TABS: Array<{ id: ShopTabType; label: string }> = [
  { id: 'credit', label: '크레딧 구매하기' },
  { id: 'event', label: '이벤트' },
];

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
