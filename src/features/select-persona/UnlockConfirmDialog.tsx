'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Dialog } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { StatusModal } from '@/shared/ui/status-modal';
import type { PersonaProduct } from '@/types/persona';

// ── 페르소나 해금 확인 다이얼로그 ─────────────────────────────────
// Flow: confirm → processing → success / error
// ─────────────────────────────────────────────────────────────────

type UnlockStep = 'confirm' | 'processing' | 'success' | 'error';

interface UnlockConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaProduct | null;
  /** 해금 처리 콜백 — 실제 API 연동 시 사용 */
  onConfirmUnlock?: (persona: PersonaProduct) => Promise<boolean>;
  /** 해금 완료 후 "홈 화면으로" 콜백 */
  onGoHome?: () => void;
  /** 해금 실패 시 "고객지원" 콜백 */
  onContactSupport?: () => void;
}

export function UnlockConfirmDialog({
  isOpen,
  onClose,
  persona,
  onConfirmUnlock,
  onGoHome,
  onContactSupport,
}: UnlockConfirmDialogProps) {
  const [step, setStep] = useState<UnlockStep>('confirm');

  if (!persona) return null;

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  const handleConfirm = async () => {
    setStep('processing');

    try {
      if (onConfirmUnlock) {
        const result = await onConfirmUnlock(persona);
        setStep(result ? 'success' : 'error');
      } else {
        // TODO: 실제 해금 API 연동
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStep('success');
      }
    } catch {
      setStep('error');
    }
  };

  /* ── 확인 단계 ─────────────────────────────────────────────── */
  if (step === 'confirm') {
    return (
      <Dialog isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[440px]" accessibleTitle={`${persona.name} 해금 확인`}>
        <div className="flex flex-col items-center gap-6">
          {/* 페르소나 요약 */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg shrink-0">
              <Image
                src={persona.image}
                alt={persona.name}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
              {persona.name} 해금
            </h2>
            <p className="text-prime-600 text-base leading-[1.4] font-medium">
              <span className="text-success-500 font-semibold">
                {persona.unlockCredits} 크레딧
              </span>
              이 차감됩니다.
            </p>
          </div>

          {/* 정보 박스 */}
          <div className="bg-secondary-100 w-full rounded-lg p-4">
            <p className="text-prime-700 mb-1 text-sm font-semibold">{persona.quote}</p>
            <p className="text-prime-500 text-xs leading-[1.6] font-normal">
              {persona.description}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex w-full gap-3">
            <Button variant="secondary" size="default" onClick={handleClose} className="flex-1">
              취소
            </Button>
            <Button variant="primary" size="default" onClick={handleConfirm} className="flex-1">
              해금하기
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  /* ── 처리 중 ───────────────────────────────────────────────── */
  if (step === 'processing') {
    return (
      <StatusModal
        isOpen={isOpen}
        onClose={handleClose}
        semantic="progress"
        title="해금이 진행중입니다"
        description="크레딧을 차감하고 페르소나를 해금하는 중입니다. 잠시만 기다려 주세요."
        creditAmount={persona.unlockCredits}
      />
    );
  }

  /* ── 해금 완료 ─────────────────────────────────────────────── */
  if (step === 'success') {
    return (
      <StatusModal
        isOpen={isOpen}
        onClose={handleClose}
        semantic="safe"
        title="해금이 완료되었습니다"
        description={`${persona.name} 페르소나가 해금되었습니다. 채팅에서 바로 사용해 보세요!`}
        creditAmount={persona.unlockCredits}
        actions={[
          {
            label: '홈 화면으로',
            variant: 'secondary',
            onClick: () => {
              if (onGoHome) {
                onGoHome();
              } else {
                handleClose();
              }
            },
          },
          {
            label: '계속 둘러보기',
            variant: 'primary',
            onClick: handleClose,
          },
        ]}
      />
    );
  }

  /* ── 해금 실패 ─────────────────────────────────────────────── */
  return (
    <StatusModal
      isOpen={isOpen}
      onClose={handleClose}
      semantic="warning"
      title="해금이 실패했습니다"
      description={
        <>
          크레딧 차감 중 문제가 발생했습니다.
          <br />
          크레딧 잔액을 확인하거나 고객지원에 문의해 주세요.
        </>
      }
      creditAmount={persona.unlockCredits}
      actions={[
        {
          label: '고객지원 확인하기',
          variant: 'secondary',
          semantic: 'red',
          onClick: () => {
            if (onContactSupport) {
              onContactSupport();
            } else {
              handleClose();
            }
          },
        },
        {
          label: '다시 시도하기',
          variant: 'primary',
          onClick: handleConfirm,
        },
      ]}
    />
  );
}
