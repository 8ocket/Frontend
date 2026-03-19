import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

// ── Figma 디자인 시스템: 버튼 (node 1271:1955) ────────────────────────
// Font: Pretendard Medium 16px, lineHeight: 1, letterSpacing: 0
// Regular Button: 76×44, rounded-lg (8px)
// CTA: 359×44, rounded-full (22px)
// Semantic: Blue(default), Yellow, Red, Green
// States: Default, Hover, Pressed(active), Disabled, Error
// ─────────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-base leading-none font-medium transition-all' +
    ' disabled:pointer-events-none disabled:cursor-not-allowed' +
    " [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        // ── Primary (filled) ─────────────────────────────────────
        // Blue default: bg cta-300, text prime-900 (dark text on light blue)
        primary:
          'bg-cta-300 text-prime-900 hover:bg-[#4ba1f0] active:bg-[#257cc0]' +
          ' disabled:bg-[#cacaca] disabled:text-neutral-400' +
          ' dark:bg-cta-400 dark:text-prime-950 dark:hover:bg-cta-300 dark:active:bg-cta-500 dark:disabled:bg-tertiary-700 dark:disabled:text-tertiary-500',

        // ── Secondary (outlined) ─────────────────────────────────
        // Blue default: bg secondary-100, border cta-300, text prime-600
        secondary:
          'bg-secondary-100 border border-cta-300 text-prime-600' +
          ' hover:bg-neutral-300 hover:text-prime-700 hover:border-[#4ba1f0]' +
          ' active:bg-neutral-300 active:text-prime-800 active:border-[#257cc0]' +
          ' disabled:bg-secondary-100 disabled:text-[#cacaca] disabled:border-[#cacaca]' +
          ' dark:bg-prime-800 dark:text-cta-300 dark:border-cta-300 dark:hover:bg-prime-700 dark:hover:text-cta-400 dark:hover:border-cta-400 dark:disabled:text-tertiary-500 dark:disabled:border-tertiary-700',

        // ── Ghost (transparent) ──────────────────────────────────
        // Blue default: bg transparent, text prime-800
        ghost:
          'bg-transparent text-prime-800' +
          ' hover:bg-neutral-300 hover:text-prime-700' +
          ' active:bg-neutral-300 active:text-prime-800' +
          ' disabled:text-neutral-400' +
          ' dark:text-cta-300 dark:hover:bg-prime-800 dark:hover:text-cta-400 dark:disabled:text-tertiary-500',

        // ── Allow (동의 버튼) ────────────────────────────────────
        // rounded-sm(4px), border neutral-300
        // data-pressed: glass-blue 배경 + cta-300 보더
        allow:
          'bg-secondary-100 border border-neutral-300 text-prime-900' +
          ' data-[pressed=true]:bg-interactive-glass-blue-50 data-[pressed=true]:border-cta-300',

        // ── Mode Select (다크/라이트 모드 선택) ──────────────────
        // Heading 04: SemiBold 16px, lineHeight 1.3, letterSpacing -1.5
        'mode-dark':
          'bg-prime-900 text-secondary-100 font-semibold tracking-[-1.5px] leading-[1.3]',
        'mode-light':
          'bg-secondary-100 text-prime-900 font-semibold tracking-[-1.5px] leading-[1.3]',

        // ── shadcn 호환 (내부 컴포넌트용) ────────────────────────
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      semantic: {
        blue: '',
        yellow: '',
        red: '',
        green: '',
      },
      size: {
        default: 'h-11 px-4 rounded-lg',
        cta: 'h-11 w-full rounded-full px-8',
        sm: 'h-8 px-3 rounded-md text-xs',
        lg: 'h-12 px-6 rounded-lg',
        icon: 'size-11 rounded-lg',
      },
    },
    compoundVariants: [
      // ── Special variant: 라운딩 오버라이드 ──────────────────
      { variant: 'allow', className: 'w-full rounded-sm' },
      { variant: 'mode-dark', className: 'rounded-md' },
      { variant: 'mode-light', className: 'rounded-md' },

      // ── Semantic: Yellow ────────────────────────────────────
      {
        variant: 'primary',
        semantic: 'yellow',
        className:
          'bg-warning-600 text-prime-900 hover:bg-warning-800 hover:text-prime-300 active:bg-warning-900 active:text-prime-400',
      },
      {
        variant: 'secondary',
        semantic: 'yellow',
        className:
          'border-warning-600 text-warning-700 hover:border-warning-700 active:border-warning-800',
      },
      {
        variant: 'ghost',
        semantic: 'yellow',
        className: 'text-warning-700',
      },

      // ── Semantic: Red ──────────────────────────────────────
      {
        variant: 'primary',
        semantic: 'red',
        className: 'bg-error-600 text-secondary-100 hover:bg-error-700 active:bg-error-800',
      },
      {
        variant: 'secondary',
        semantic: 'red',
        className: 'border-error-600 text-error-600 hover:border-error-700 active:border-error-800',
      },
      {
        variant: 'ghost',
        semantic: 'red',
        className: 'text-error-600',
      },

      // ── Semantic: Green ────────────────────────────────────
      {
        variant: 'primary',
        semantic: 'green',
        className: 'bg-success-800 text-secondary-100 hover:bg-success-900 active:bg-success-950',
      },
      {
        variant: 'secondary',
        semantic: 'green',
        className:
          'border-success-800 text-success-800 hover:border-success-900 active:border-success-950',
      },
      {
        variant: 'ghost',
        semantic: 'green',
        className: 'text-success-800',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      semantic: 'blue',
      size: 'default',
    },
  }
);

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
type ButtonSemantic = NonNullable<VariantProps<typeof buttonVariants>['semantic']>;

function Button({
  className,
  variant = 'primary',
  size = 'default',
  semantic = 'blue',
  error = false,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** CTA 에러 상태 (bg-error-100 + text-error-700) */
    error?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  // CTA Primary: 텍스트 컬러를 흰색(inverse)으로 오버라이드
  // (일반 Primary는 dark text, CTA Primary만 white text — Figma 스펙)
  const ctaOverride =
    size === 'cta' && variant === 'primary' && !error
      ? 'text-secondary-100 disabled:text-secondary-100'
      : '';

  // CTA Error 상태 스타일
  const errorClass = error
    ? variant === 'secondary'
      ? 'border-error-700 text-error-700'
      : 'bg-error-100 text-error-700'
    : '';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-semantic={semantic}
      className={cn(
        buttonVariants({ variant, size, semantic }),
        ctaOverride,
        errorClass,
        className
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonVariant, ButtonSemantic };
