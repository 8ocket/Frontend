import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        // ── MindLog 디자인 시스템 ──────────────────────────────
        // Light: bg cta-300, text secondary-100
        // Dark:  bg cta-400, text prime-950 (밝은 배경에서 대비 확보)
        primary:
          'bg-cta-300 text-secondary-100 hover:bg-[#4ba1f0] active:bg-[#257cc0] disabled:bg-[#cacaca] disabled:text-neutral-400' +
          ' dark:bg-cta-400 dark:text-prime-950 dark:hover:bg-cta-300 dark:active:bg-cta-500 dark:disabled:bg-tertiary-700 dark:disabled:text-tertiary-500',
        // Light: bg secondary-100, border+text cta-300
        // Dark:  bg prime-800, border+text cta-300
        secondary:
          'bg-secondary-100 text-cta-300 border border-cta-300 hover:bg-neutral-300 hover:text-[#4ba1f0] hover:border-[#4ba1f0] active:bg-neutral-300 active:text-[#257cc0] active:border-[#257cc0] disabled:text-[#cacaca] disabled:border-[#cacaca]' +
          ' dark:bg-prime-800 dark:text-cta-300 dark:border-cta-300 dark:hover:bg-prime-700 dark:hover:text-cta-400 dark:hover:border-cta-400 dark:disabled:text-tertiary-500 dark:disabled:border-tertiary-700',
        // Light: transparent, text cta-300
        // Dark:  transparent, text cta-300 (hover는 prime-800)
        ghost:
          'bg-transparent text-cta-300 hover:bg-neutral-300 hover:text-[#4ba1f0] active:bg-neutral-300 active:text-[#257cc0] disabled:text-neutral-400' +
          ' dark:text-cta-300 dark:hover:bg-prime-800 dark:hover:text-cta-400 dark:disabled:text-tertiary-500',
        // ── shadcn 호환 (내부 컴포넌트용) ──────────────────────
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 rounded-lg text-sm',
        cta: 'h-11 w-full rounded-full px-8 text-base',
        sm: 'h-8 px-3 rounded-md text-xs',
        lg: 'h-12 px-6 rounded-lg text-base',
        icon: 'size-11 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'primary',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
