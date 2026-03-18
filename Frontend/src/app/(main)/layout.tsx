import { GNB } from '@/components/layout/gnb';
import { Footer } from '@/components/layout/footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GNB />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
