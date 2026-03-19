import * as React from 'react';

import { cn } from '@/shared/lib/utils';

// Figma: Input component (1276:2420)
// 320x44, r:8
// bg: secondary-100 (#f8fafc)
// border: neutral-300 (#e2e8f0) default/focus/filled
// border error: error-700 (#8e0c0c)
// disabled: bg neutral-300 (#e2e8f0), border neutral-200 (#f1f5f9)
// placeholder: neutral-400 (#cbd5e1)
// text: prime-900 (#1a222e)
// font: 14px / Regular(400)

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-lg border px-3',
        // Light mode
        'bg-secondary-100 border-neutral-300',
        'text-sm text-prime-900 placeholder:text-neutral-400',
        // Dark mode
        'dark:bg-prime-800 dark:border-tertiary-700',
        'dark:text-secondary-100 dark:placeholder:text-tertiary-400',
        // Focus
        'transition-[border-color,box-shadow]',
        'focus-visible:outline-none focus-visible:border-cta-300 focus-visible:ring-2 focus-visible:ring-cta-300/20',
        'dark:focus-visible:border-cta-400 dark:focus-visible:ring-cta-400/20',
        // Error
        'aria-invalid:border-error-700 aria-invalid:ring-2 aria-invalid:ring-error-700/20',
        'dark:aria-invalid:border-error-400 dark:aria-invalid:ring-error-400/20',
        // Disabled
        'disabled:bg-neutral-300 disabled:border-neutral-200 disabled:cursor-not-allowed disabled:placeholder:text-neutral-400',
        'dark:disabled:bg-prime-900 dark:disabled:border-prime-700',
        className
      )}
      {...props}
    />
  );
}

export { Input };
