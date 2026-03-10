'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// ── Figma 디자인 시스템: Status Modal ───────────────────────────
// 350px, rounded-xl(12px), p-24(24px), border 2px glass-stroke/30
// bg: secondary-100 (#f8fafc)
//
// 5가지 시맨틱 variant (첨부 디자인 기준):
//   safe (green)         — 결제 완료         — 제목: success-800
//   warning (red)        — 결제 중단         — 제목: error-600
//   progress (blue)      — 결제 진행중       — 제목: info-600
//   information (yellow) — 상품 정보 갱신     — 제목: warning-600
//   refund (red)         — 환불정책 확인      — 제목: error-600
//
// Title: Heading 02 (SemiBold 24px, tracking -0.36px, leading 1.3)
// Body:  Body 01 (Regular 16px, lineHeight 1.6, prime-700)
// Credit label: tertiary-400 (#8a9ba8)
// Credit value: info-500 (blue) | error-600 (red)
// Divider above credit: secondary-200
// Agreement checkbox: ✓ cta-300 checked, neutral-300 border
// Buttons: gap-4(16px), flex-1 equal width
// ─────────────────────────────────────────────────────────────────

export type StatusModalSemantic =
  | 'safe'
  | 'warning'
  | 'progress'
  | 'information'
  | 'refund';

export interface StatusModalAction {
  label: string;
  /** 'primary' = filled, 'secondary' = outlined */
  variant?: 'primary' | 'secondary';
  /** semantic 매칭: 기본값은 모달 semantic에서 유추 */
  semantic?: 'blue' | 'red' | 'yellow' | 'green';
  onClick: () => void;
  disabled?: boolean;
}

export interface StatusModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 시맨틱 타입 */
  semantic: StatusModalSemantic;
  /** 제목 텍스트 */
  title: string;
  /** 설명 텍스트 (React 노드 지원 — 밑줄/볼드 등) */
  description?: React.ReactNode;
  /** 주문 크레딧 표시 값 (숫자 또는 포맷된 문자열) */
  creditAmount?: string | number;
  /** 하단 버튼 목록 (좌→우) */
  actions?: StatusModalAction[];
  /** 환불 정책 동의 체크박스 사용 여부 */
  showAgreement?: boolean;
  /** 동의 체크박스 라벨 */
  agreementLabel?: string;
  /** 추가 className */
  className?: string;
}

// ── 시맨틱별 스타일 매핑 ────────────────────────────────────────
const TITLE_COLOR: Record<StatusModalSemantic, string> = {
  safe: 'text-success-800',
  warning: 'text-error-600',
  progress: 'text-info-600',
  information: 'text-warning-600',
  refund: 'text-error-600',
};

const CREDIT_COLOR: Record<StatusModalSemantic, string> = {
  safe: 'text-info-500',
  warning: 'text-error-600',
  progress: 'text-info-600',
  information: 'text-info-500',
  refund: 'text-error-600',
};

const BUTTON_SEMANTIC: Record<StatusModalSemantic, 'blue' | 'red' | 'yellow' | 'green'> = {
  safe: 'green',
  warning: 'red',
  progress: 'blue',
  information: 'yellow',
  refund: 'red',
};

export function StatusModal({
  isOpen,
  onClose,
  semantic,
  title,
  description,
  creditAmount,
  actions,
  showAgreement = false,
  agreementLabel = '위 내용을 확인 했습니다.',
  className,
}: StatusModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  // 모달이 닫힐 때 체크 상태 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsAgreed(false);
      onClose();
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose={false}
        maxWidth="max-w-[350px]"
        className={cn('p-6', className)}
      >
        <div className="flex flex-col items-center gap-6">
          {/* ── 텍스트 영역: 제목 + 설명 ── */}
          <div className="flex w-full flex-col items-center gap-4">
            {/* 제목 — Heading 02 */}
            <DialogTitle
              className={cn(
                'w-full text-center text-2xl leading-[1.3] font-semibold tracking-[-0.36px]',
                TITLE_COLOR[semantic]
              )}
            >
              {title}
            </DialogTitle>

            {/* 설명 — Body 01 */}
            {description && (
              <DialogDescription className="text-prime-700 w-full text-center text-base leading-[1.6] font-normal">
                {description}
              </DialogDescription>
            )}
          </div>

          {/* ── 로딩 스피너 (progress만) ── */}
          {semantic === 'progress' && (
            <div className="flex items-center justify-center">
              <div className="border-info-500 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}

          {/* ── 주문 크레딧 정보 (구분선 포함) ── */}
          {creditAmount !== undefined && (
            <div className="flex w-full flex-col items-center gap-4">
              <div className="bg-secondary-200 h-px w-full" />
              <div className="flex items-center gap-4">
                <span className="text-tertiary-400 text-base leading-[1.6] font-normal whitespace-nowrap">
                  주문하신 크레딧 :
                </span>
                <span
                  className={cn(
                    'text-base leading-[1.6] font-normal whitespace-nowrap',
                    CREDIT_COLOR[semantic]
                  )}
                >
                  {typeof creditAmount === 'number'
                    ? creditAmount.toLocaleString()
                    : creditAmount}
                </span>
              </div>
            </div>
          )}

          {/* ── 동의 체크박스 (환불 정책 등) ── */}
          {showAgreement && (
            <label className="flex cursor-pointer items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAgreed(!isAgreed)}
                className={cn(
                  'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm border transition-colors',
                  isAgreed
                    ? 'border-cta-300 bg-cta-300'
                    : 'border-neutral-300 bg-secondary-100'
                )}
              >
                {isAgreed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-sm leading-none font-medium text-black">
                {agreementLabel}
              </span>
            </label>
          )}

          {/* ── 하단: 버튼 영역 ── */}
          {actions && actions.length > 0 && (
            <div className="flex w-full gap-4">
              {actions.map((action, idx) => {
                const btnSemantic = action.semantic ?? BUTTON_SEMANTIC[semantic];
                const btnVariant = action.variant ?? (idx === 0 && actions.length > 1 ? 'secondary' : 'primary');
                const isDisabled = action.disabled ?? (showAgreement && btnVariant === 'primary' && !isAgreed);

                return (
                  <Button
                    key={idx}
                    variant={btnVariant}
                    semantic={btnSemantic}
                    size="default"
                    onClick={action.onClick}
                    disabled={isDisabled}
                    className="flex-1"
                  >
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
