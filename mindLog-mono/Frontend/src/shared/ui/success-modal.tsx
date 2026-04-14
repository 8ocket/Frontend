import React from 'react';
import { StatusModal } from './status-modal';

export interface SuccessModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly subtitle?: string;
  readonly description?: string;
  readonly buttonLabel?: string;
  readonly onButtonClick?: () => void;
}

/**
 * StatusModal semantic="safe" 기반 성공 모달 래퍼.
 * 기존 SuccessModal API를 유지하면서 내부적으로 공통 컴포넌트를 활용합니다.
 */
export function SuccessModal({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  buttonLabel = '확인',
  onButtonClick,
}: SuccessModalProps) {
  const handleButtonClick = () => {
    onButtonClick?.();
    onClose();
  };

  // subtitle과 description을 하나의 description 노드로 합침
  const descriptionNode =
    subtitle || description ? (
      <>
        {subtitle && <span>{subtitle}</span>}
        {subtitle && description && <br />}
        {description && (
          <span className="text-prime-500 text-sm">{description}</span>
        )}
      </>
    ) : undefined;

  return (
    <StatusModal
      isOpen={isOpen}
      onClose={onClose}
      semantic="safe"
      title={title}
      description={descriptionNode}
      actions={[
        {
          label: buttonLabel,
          variant: 'primary',
          onClick: handleButtonClick,
        },
      ]}
    />
  );
}
