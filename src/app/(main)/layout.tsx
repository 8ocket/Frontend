import { GNB } from '@/widgets/gnb';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GNB />
      <main className="bg-secondary-100 min-h-screen-safe pt-16 box-border md:pt-20">
        {children}
      </main>
    </>
  );
}
