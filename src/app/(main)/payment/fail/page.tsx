'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') ?? '알 수 없는 오류가 발생했습니다.';

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p>결제가 실패했습니다.</p>
      <p className="text-sm text-gray-500">{message}</p>
      <button onClick={() => router.push('/shop')}>다시 시도</button>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <PaymentFailContent />
    </Suspense>
  );
}
