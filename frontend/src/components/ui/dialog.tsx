'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

// ── Figma 디자인 시스템: Dialog / Modal ─────────────────────────
// Overlay: bg-black/20, backdrop-blur-sm
// Container: bg-secondary-100, border 2px glass-stroke/30,
//            rounded-lg (12px), p-24
// ─────────────────────────────────────────────────────────────────

/* ── Radix 기반 Primitive 빌딩블록 ─────────────────────────────── */

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/20 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose = true,
  maxWidth = 'max-w-[602px]',
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showClose?: boolean;
  maxWidth?: string;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-secondary-100 fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
          'rounded-xl border-2 border-[rgba(130,201,255,0.3)] p-6 shadow-lg',
          'focus:outline-none',
          maxWidth,
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:outline-none disabled:pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#1a222e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">닫기</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-prime-900 text-lg leading-[1.3] font-semibold', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-prime-700 text-base leading-[1.6]', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex w-full items-center justify-between', className)}
      {...props}
    />
  );
}

// ── 레거시 호환 래퍼 ────────────────────────────────────────────
// 기존 <Dialog isOpen onClose> 패턴을 Radix 기반으로 유지
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** 시각적으로 표시되는 제목 */
  title?: string;
  /**
   * title이 없을 때 스크린 리더 전용 접근성 제목.
   * Radix DialogTitle은 항상 필요하므로, title이 없으면 이 값을 sr-only로 렌더링합니다.
   * @default '다이얼로그'
   */
  accessibleTitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  closeButton?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  accessibleTitle = '다이얼로그',
  children,
  maxWidth = 'max-w-[602px]',
  closeButton = true,
}: DialogProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={closeButton} maxWidth={maxWidth}>
        {title ? (
          <DialogHeader className="border-secondary-200 mb-6 border-b pb-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        ) : (
          /* 시각적 제목이 없어도 스크린 리더 접근성을 위해 항상 DialogTitle 렌더링 */
          <DialogTitle className="sr-only">{accessibleTitle}</DialogTitle>
        )}
        <DialogPrimitive.Description asChild>
          <div>{children}</div>
        </DialogPrimitive.Description>
      </DialogContent>
    </DialogRoot>
  );
}

export {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
