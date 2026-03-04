import React from 'react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  closeButton?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-[602px]',
  closeButton = true,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div
        className={`relative flex w-full ${maxWidth} border-secondary-200 flex-col rounded-3xl border bg-white p-6 shadow-lg`}
      >
        {/* 헤더 */}
        {title && (
          <div className="border-secondary-200 mb-6 flex items-center justify-between border-b pb-4">
            <h2 className="text-prime-900 text-lg leading-[1.3] font-semibold">{title}</h2>
            {closeButton && (
              <button
                onClick={onClose}
                className="text-tertiary-400 hover:text-tertiary-500 text-2xl transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* 콘텐츠 */}
        {children}
      </div>
    </div>
  );
}
