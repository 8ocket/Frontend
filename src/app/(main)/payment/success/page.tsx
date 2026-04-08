'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { confirmPaymentApi, getMyCreditApi } from '@/entities/credits/api';
import { useCreditStore } from '@/entities/credits/store';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = Number(searchParams.get('amount'));

    if (!paymentKey || !orderId || isNaN(amount)) {
      Promise.resolve().then(() => setStatus('error'));
      return;
    }

    confirmPaymentApi(paymentKey, orderId, amount)
      .then(() => getMyCreditApi().then((credit) => useCreditStore.getState().setTotalCredit(credit.totalCredit)))
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  if (status === 'loading') return <p className="p-8 text-center">결제 확인 중...</p>;
  if (status === 'error')
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <p>결제 처리 중 문제가 발생했습니다.</p>
        <button onClick={() => router.push('/shop')}>다시 시도</button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p>결제가 완료되었습니다.</p>
      <button onClick={() => router.push('/')}>홈으로</button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
