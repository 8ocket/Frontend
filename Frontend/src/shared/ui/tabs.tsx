'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/shared/lib/utils';

// ── Figma 디자인 시스템: Tabs ───────────────────────────────────
// Border: cta-300, 1px
// 높이: 44px (h-11), Radius: MD (8px)
// 탭 간격: 16px (gap-4), 패딩: 10px (p-2.5)
// Active: bg-interactive/glass/blue-50 (rgba(130,201,255,0.5))
// Inactive: text-prime-500
// Font: Pretendard Medium 16px
// ─────────────────────────────────────────────────────────────────

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn(className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'border-cta-300 dark:border-cta-400 flex w-full h-11 items-center justify-center gap-4 rounded-md border px-1 sm:inline-flex sm:w-auto',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'text-prime-500 dark:text-prime-400 inline-flex h-9 flex-1 items-center justify-center rounded-md p-2.5 sm:flex-none sm:w-35',
        'text-base leading-none font-medium whitespace-nowrap transition-all',
        'focus-visible:ring-cta-300 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-interactive-glass-blue-50 data-[state=active]:text-prime-900',
        'dark:data-[state=active]:text-prime-900',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('mt-2 focus-visible:ring-2 focus-visible:outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
