'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFailContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/shop?payment=error');
  }, [router]);

  return null;
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <PaymentFailContent />
    </Suspense>
  );
}
