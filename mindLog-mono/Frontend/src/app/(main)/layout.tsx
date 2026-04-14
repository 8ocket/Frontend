import { GNB } from '@/widgets/gnb';

export default function MainLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <GNB />
      <main className="bg-secondary-100 flex flex-1 flex-col box-border pt-16 md:pt-20">
        {children}
      </main>
    </>
  );
}
