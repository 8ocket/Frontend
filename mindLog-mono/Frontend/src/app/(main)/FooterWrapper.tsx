'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/widgets/gnb';

const NO_FOOTER_PATHS = ['/report'];

export function FooterWrapper() {
  const pathname = usePathname();
  if (NO_FOOTER_PATHS.includes(pathname)) return null;
  return <Footer />;
}
