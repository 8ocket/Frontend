'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './footer';

const NO_FOOTER_PATHS = ['/login', '/signup', '/chat', '/report'];

export function FooterWrapper() {
  const pathname = usePathname();
  if (NO_FOOTER_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) return null;
  return <Footer />;
}
