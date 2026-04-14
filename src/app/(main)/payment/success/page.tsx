'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { confirmPaymentApi, getMyCreditApi } from '@/entities/credits/api';
import { useCreditStore } from '@/entities/credits/store';
import { StatusModal } from '@/shared/ui/status-modal';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = Number(searchParams.get('amount'));

    if (!paymentKey || !orderId || isNaN(amount)) {
      router.replace('/shop?payment=error');
      return;
    }

    const productParam = searchParams.get('product') ?? '';

    confirmPaymentApi(paymentKey, orderId, amount)
      .then(() =>
        getMyCreditApi().then((credit) =>
          useCreditStore.getState().setTotalCredit(credit.totalCredit)
        )
      )
      .then(() => router.replace(`/shop?payment=success&product=${encodeURIComponent(productParam)}`))
      .catch(() => router.replace('/shop?payment=error'));
  }, [searchParams, router]);

  return (
    <StatusModal
      isOpen
      onClose={() => {}}
      semantic="progress"
      title="결제가 진행중입니다"
      description="결제 정보를 안전하게 확인 중에 있습니다. 잠시만 기다려주시면 됩니다."
    />
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
