'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CreditProduct } from '@/types/credit';

// ── 구매 확인 다이얼로그 ────────────────────────────────────────
// Dialog 공통 컴포넌트를 활용한 크레딧 구매 확인 플로우
// 단계: 확인 → 처리 중 → 완료/실패
// ─────────────────────────────────────────────────────────────────

type PurchaseStep = 'confirm' | 'processing' | 'success' | 'error';

interface PurchaseConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: CreditProduct | null;
  /** 결제 처리 콜백 — 실제 API 연동 시 사용 */
  onConfirmPurchase?: (product: CreditProduct) => Promise<boolean>;
}

export function PurchaseConfirmDialog({
  isOpen,
  onClose,
  product,
  onConfirmPurchase,
}: PurchaseConfirmDialogProps) {
  const [step, setStep] = useState<PurchaseStep>('confirm');

  if (!product) return null;

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  const handleConfirm = async () => {
    setStep('processing');

    try {
      if (onConfirmPurchase) {
        const success = await onConfirmPurchase(product);
        setStep(success ? 'success' : 'error');
      } else {
        // TODO: 실제 결제 API 연동
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStep('success');
      }
    } catch {
      setStep('error');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[440px]">
      {step === 'confirm' && (
        <div className="flex flex-col items-center gap-6">
          {/* 상품 요약 */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-cta-100 flex h-16 w-16 items-center justify-center rounded-full">
              <Image
                src="/images/icons/credit.svg"
                alt="credit"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
            <h2 className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
              {product.name} 구매
            </h2>
            <p className="text-prime-600 text-base leading-[1.4] font-medium">
              {product.credits.toLocaleString()} 크레딧 ·{' '}
              <span className="text-prime-900 font-semibold">{product.priceFormatted}₩</span>
            </p>
          </div>

          {/* 혜택 미리보기 */}
          <div className="bg-cta-100/30 w-full rounded-lg p-4">
            <p className="text-prime-700 mb-2 text-sm font-semibold">포함 혜택</p>
            <ul className="text-prime-500 flex flex-col gap-1.5 text-xs leading-[1.4] font-medium">
              {product.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cta-300 mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
              {product.benefits.length > 3 && (
                <li className="text-prime-400 text-xs">
                  외 {product.benefits.length - 3}개 혜택
                </li>
              )}
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex w-full gap-3">
            <Button
              variant="secondary"
              size="default"
              onClick={handleClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={handleConfirm}
              className="flex-1"
            >
              결제하기
            </Button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="flex flex-col items-center gap-4 py-8">
          {/* 로딩 스피너 */}
          <div className="border-cta-300 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-prime-700 text-base font-medium">결제 처리 중...</p>
          <p className="text-prime-500 text-sm">잠시만 기다려 주세요.</p>
        </div>
      )}

      {step === 'success' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-success-100 flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#0c8a60"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-prime-900 text-xl leading-[1.3] font-semibold">
              구매가 완료되었습니다!
            </h2>
            <p className="text-prime-600 text-base font-medium">
              {product.credits.toLocaleString()} 크레딧이 충전되었습니다.
            </p>
          </div>
          <Button
            variant="primary"
            size="default"
            onClick={handleClose}
            className="w-full"
          >
            확인
          </Button>
        </div>
      )}

      {step === 'error' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-error-100 flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#bd1010"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-prime-900 text-xl leading-[1.3] font-semibold">
              결제에 실패했습니다
            </h2>
            <p className="text-prime-500 text-sm font-medium">
              다시 시도해 주세요. 문제가 지속되면 고객지원에 문의해 주세요.
            </p>
          </div>
          <div className="flex w-full gap-3">
            <Button
              variant="secondary"
              size="default"
              onClick={handleClose}
              className="flex-1"
            >
              닫기
            </Button>
            <Button
              variant="primary"
              semantic="red"
              size="default"
              onClick={handleConfirm}
              className="flex-1"
            >
              다시 시도
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
