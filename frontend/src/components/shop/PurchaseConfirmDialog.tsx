'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusModal } from '@/components/ui/status-modal';
import type { CreditProduct } from '@/types/credit';

// ── 구매 확인 다이얼로그 ────────────────────────────────────────
// confirm 단계 → 고유 레이아웃 (Dialog 래퍼)
// processing / success / error → StatusModal 공통 컴포넌트 활용
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

  /* ── 확인 단계: 고유 레이아웃 ──────────────────────────────── */
  if (step === 'confirm') {
    return (
      <Dialog isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[440px]" accessibleTitle={`${product.name} 구매 확인`}>
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
      </Dialog>
    );
  }

  /* ── 결제 진행 중 ──────────────────────────────────────────── */
  if (step === 'processing') {
    return (
      <StatusModal
        isOpen={isOpen}
        onClose={handleClose}
        semantic="progress"
        title="결제가 진행중입니다"
        description="결제 정보를 안전하게 확인 중에 있습니다. 잠시만 기다려주시면 됩니다."
        creditAmount={product.credits}
      />
    );
  }

  /* ── 결제 완료 ─────────────────────────────────────────────── */
  if (step === 'success') {
    return (
      <StatusModal
        isOpen={isOpen}
        onClose={handleClose}
        semantic="safe"
        title="결제가 완료되었습니다"
        description="제품을 구매가 되었는지 확인해 주시고, 문제가 있을 시 고객센터로 연락을 부탁드립니다."
        creditAmount={product.credits}
        actions={[
          { label: '결제 내역 보기', variant: 'secondary', onClick: handleClose },
          { label: '홈 화면에 가기', variant: 'primary', onClick: handleClose },
        ]}
      />
    );
  }

  /* ── 결제 중단 ─────────────────────────────────────────────── */
  return (
    <StatusModal
      isOpen={isOpen}
      onClose={handleClose}
      semantic="warning"
      title="결제가 중단되었습니다"
      description="알 수 없는 원인으로 인한 거래가 중단되었습니다. 인터넷 연결을 다시 확인해볼수 있습니다. 지속적 문제가 발생 시, 고객지원에 문의 해주세요."
      actions={[
        { label: '고객지원 확인하기', variant: 'secondary', onClick: handleClose },
        { label: '돌아가기', variant: 'primary', onClick: handleConfirm },
      ]}
    />
  );
}
