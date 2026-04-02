'use client';

import React, { useState } from 'react';

import { StatusModal } from '@/shared/ui/status-modal';
import type { CreditProduct } from '@/types/credit';
import { useCreditStore } from '@/entities/credits/store';
import { getMyCreditApi } from '@/entities/credits/api';

// ── 구매 확인 다이얼로그 ────────────────────────────────────────
// Flow: confirm → processing → success / error / product-updated
//
// confirm         — 상품 확인 + 환불 동의 체크박스
// processing      — 결제 진행중
// success         — 결제 완료
// error           — 결제 중단
// product-updated — 상품 정보 갱신
// ─────────────────────────────────────────────────────────────────

type PurchaseStep = 'confirm' | 'processing' | 'success' | 'error' | 'product-updated';

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
}

export function PurchaseConfirmDialog({
  isOpen,
  onClose,
  product,
  onConfirmPurchase,
  onViewHistory,
  onGoHome,
  onContactSupport,
}: PurchaseConfirmDialogProps) {
  const { addPaidCredit, setTotalCredit } = useCreditStore();
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
        const result = await onConfirmPurchase(product);
        if (result === false) {
          setStep('error');
        } else {
          addPaidCredit(product.credits);
          const credit = await getMyCreditApi();
          setTotalCredit(credit.totalCredit);
          setStep('success');
        }
      } else {
        // TODO: 실제 결제 API 연동
        await new Promise((resolve) => setTimeout(resolve, 1500));
        addPaidCredit(product.credits);
        const credit = await getMyCreditApi();
        setTotalCredit(credit.totalCredit);
        setStep('success');
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'PRODUCT_UPDATED') {
        setStep('product-updated');
      } else {
        setStep('error');
      }
    }
  };

  /* ── 확인 단계 ──────────────────────────────────────────────── */
  if (step === 'confirm') {
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
            label: '결제하기',
            variant: 'primary',
            onClick: handleConfirm,
          },
        ]}
      />
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

  /* ── 결제 완료 ───────────────────────────────────────────────── */
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

  /* ── 상품 정보 갱신 ──────────────────────────────────────────── */
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
            onClick: () => setStep('confirm'),
          },
        ]}
      />
    );
  }

  /* ── 결제 중단 ───────────────────────────────────────────────── */
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
          onClick: () => setStep('confirm'),
        },
      ]}
    />
  );
}
