import { GNB } from '@/widgets/gnb';
import { Footer } from '@/widgets/gnb';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GNB />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
