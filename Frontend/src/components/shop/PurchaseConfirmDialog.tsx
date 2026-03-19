'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { Dialog } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { StatusModal } from '@/shared/ui/status-modal';
import type { CreditProduct } from '@/types/credit';
import { useAuthStore } from '@/stores/auth';

// ── 구매 확인 다이얼로그 ────────────────────────────────────────
// Figma Shop MODAL 01 ~ 04, MODAL 16 구현
//
// Flow: refund-policy → confirm → processing → success / error / product-updated
//
// refund-policy   — MODAL 16 (환불 정책 사전 고지, Red + Checkbox)
// confirm         — 고유 레이아웃 (Dialog 래퍼)
// processing      — MODAL 3  (결제 진행중, Blue + Spinner)
// success         — MODAL 01 (결제 완료, Green)
// error           — MODAL 2  (결제 중단, Red)
// product-updated — MODAL 4  (상품 정보 갱신, Yellow)
// ─────────────────────────────────────────────────────────────────

type PurchaseStep =
  | 'refund-policy'
  | 'confirm'
  | 'processing'
  | 'success'
  | 'error'
  | 'product-updated';

interface PurchaseConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: CreditProduct | null;
  /** 결제 처리 콜백 — 실제 API 연동 시 사용 */
  onConfirmPurchase?: (product: CreditProduct) => Promise<boolean>;
  /** 결제 완료 후 "결제내역 보기" 콜백 */
  onViewHistory?: () => void;
  /** 결제 완료 후 "홈 화면에 가기" 콜백 */
  onGoHome?: () => void;
  /** 결제 중단 시 "고객지원 확인하기" 콜백 */
  onContactSupport?: () => void;
  /** 환불 정책 단계를 건너뛸지 여부 (이미 확인한 경우) */
  skipRefundPolicy?: boolean;
}

export function PurchaseConfirmDialog({
  isOpen,
  onClose,
  product,
  onConfirmPurchase,
  onViewHistory,
  onGoHome,
  onContactSupport,
  skipRefundPolicy = false,
}: PurchaseConfirmDialogProps) {
  const { addCredit } = useAuthStore();
  const initialStep: PurchaseStep = skipRefundPolicy ? 'confirm' : 'refund-policy';
  const [step, setStep] = useState<PurchaseStep>(initialStep);

  if (!product) return null;

  const handleClose = () => {
    setStep(initialStep);
    onClose();
  };

  const handleConfirm = async () => {
    setStep('processing');

    try {
      if (onConfirmPurchase) {
        const result = await onConfirmPurchase(product);
        // result가 'product-updated' 문자열이면 상품 갱신 상태로
        if (result === false) {
          setStep('error');
        } else {
          addCredit(product.credits);
          setStep('success');
        }
      } else {
        // TODO: 실제 결제 API 연동
        await new Promise((resolve) => setTimeout(resolve, 1500));
        addCredit(product.credits);
        setStep('success');
      }
    } catch (err) {
      // 상품 정보 갱신 에러 구분
      if (err instanceof Error && err.message === 'PRODUCT_UPDATED') {
        setStep('product-updated');
      } else {
        setStep('error');
      }
    }
  };

  /* ── 환불 정책 확인 단계: MODAL 16 ──────────────────────────── */
  if (step === 'refund-policy') {
    return (
      <StatusModal
        isOpen={isOpen}
        onClose={handleClose}
        semantic="refund"
        title="환불 정책을 확인해주세요"
        description={
          <>
            구매 후 7일 안에 &lsquo;<u>사용하지 않은 크레딧</u>&rsquo;에 대해서는 환불이 가능하지만,
            기간이 지난 경우 환불 대상에서 제외됨을 알려드립니다.
          </>
        }
        creditAmount={product.credits}
        showAgreement
        agreementLabel="위 내용을 확인 했습니다."
        actions={[
          {
            label: '취소하기',
            variant: 'secondary',
            semantic: 'red',
            onClick: handleClose,
          },
          {
            label: '구매하기',
            variant: 'primary',
            onClick: () => setStep('confirm'),
          },
        ]}
      />
    );
  }

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

  /* ── 결제 완료: MODAL 01 ─────────────────────────────────────── */
  if (step === 'success') {
    return (
      <StatusModal
        isOpen={isOpen}
        onClose={handleClose}
        semantic="safe"
        title="결제가 완료되었습니다"
        description="제대로 구매가 되었는지 확인해 주시고, 문제가 있을 시 고객센터로 문의를 부탁드리겠습니다."
        creditAmount={product.credits}
        actions={[
          {
            label: '결제내역 보기',
            variant: 'secondary',
            onClick: () => { onViewHistory ? onViewHistory() : handleClose(); },
          },
          {
            label: '홈 화면에 가기',
            variant: 'primary',
            onClick: () => { onGoHome ? onGoHome() : handleClose(); },
          },
        ]}
      />
    );
  }

  /* ── 상품 정보 갱신: MODAL 4 ───────────────────────────────── */
  if (step === 'product-updated') {
    return (
      <StatusModal
        isOpen={isOpen}
        onClose={handleClose}
        semantic="information"
        title="상품 정보가 갱신되었습니다"
        description={
          <>
            구매 과정에서 상품 정보가 새로 갱신되었습니다.
            <br />
            다시 거래를 진행해 주시면 감사드리겠습니다.
          </>
        }
        actions={[
          {
            label: '다시 시작하기',
            variant: 'secondary',
            semantic: 'yellow',
            onClick: () => setStep(initialStep),
          },
        ]}
      />
    );
  }

  /* ── 결제 중단: MODAL 2 ────────────────────────────────────── */
  return (
    <StatusModal
      isOpen={isOpen}
      onClose={handleClose}
      semantic="warning"
      title="결제가 중단되었습니다"
      description={
        <>
          알 수 없는 원인으로 인하여 거래가 중단되었습니다.
          인터넷 연결을 먼저 확인해 보시겠습니까?
          <br />
          지속적 문제 발생 시, 고객지원에 문의 바랍니다.
        </>
      }
      creditAmount={product.credits}
      actions={[
        {
          label: '고객지원 확인하기',
          variant: 'secondary',
          semantic: 'red',
          onClick: () => { onContactSupport ? onContactSupport() : handleClose(); },
        },
        {
          label: '돌아가기',
          variant: 'primary',
          onClick: handleConfirm,
        },
      ]}
    />
  );
}
