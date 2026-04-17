import { GNB } from '@/widgets/gnb';
import { ChatNavigationTracker } from './ChatNavigationTracker';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GNB />
      <ChatNavigationTracker />
      <main className="bg-secondary-100 flex flex-1 flex-col box-border pt-16 md:pt-20">
        {children}
      </main>
    </>
  );
}
