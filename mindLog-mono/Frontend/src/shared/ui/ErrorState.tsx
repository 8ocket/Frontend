'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';

type ErrorStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
};

type ErrorStateInfoItem = {
  label: string;
  value: string;
  description?: string;
};

interface ErrorStateProps {
  readonly eyebrow: string;
  readonly code: string;
  readonly title: string;
  readonly description: string[];
  readonly accentIcon: LucideIcon;
  readonly actions: ErrorStateAction[];
  readonly helpTitle: string;
  readonly helpItems: React.ReactNode[];
  readonly infoTitle?: string;
  readonly infoItems?: ErrorStateInfoItem[];
}

export function ErrorState({
  eyebrow,
  code,
  title,
  description,
  accentIcon: AccentIcon,
  actions,
  helpTitle,
  helpItems,
  infoTitle,
  infoItems,
}: ErrorStateProps) {
  return (
    <main className="from-secondary-100 to-prime-100/70 min-h-screen-safe relative flex items-center overflow-hidden bg-gradient-to-br via-[#eef5fb] px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-cta-200/45 absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-prime-300/35 absolute right-0 bottom-0 h-80 w-80 translate-x-1/4 rounded-full blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center overflow-hidden rounded-[32px] border border-white/80 bg-white/92 px-6 py-12 text-center shadow-[0_24px_80px_rgba(17,22,30,0.1)] backdrop-blur sm:px-10 sm:py-16">
        <div className="from-cta-100 to-prime-100 text-prime-800 mb-6 flex size-18 items-center justify-center rounded-full bg-gradient-to-br shadow-inner shadow-white">
          <AccentIcon className="size-9" strokeWidth={1.75} aria-hidden="true" />
        </div>

        <p className="card-02 text-prime-500 mb-3">{eyebrow}</p>
        <h1 className="text-prime-800 mb-4 text-[4.5rem] leading-none font-semibold tracking-[-0.06em] sm:text-[6rem]">
          {code}
        </h1>
        <h2 className="text-prime-900 mb-4 text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.03em] sm:text-[2.25rem]">
          {title}
        </h2>
        <div className="mb-8 space-y-1">
          {description.map((line) => (
            <p key={line} className="text-prime-600 max-w-3xl text-sm leading-6 sm:text-base">
              {line}
            </p>
          ))}
        </div>

        <div className="mb-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          {actions.map((action) => {
            const Icon = action.icon;
            const className = 'sm:flex-1';

            if (action.href) {
              return (
                <Button
                  key={action.label}
                  asChild
                  variant={action.variant === 'secondary' ? 'secondary' : 'primary'}
                  size="cta"
                  className={className}
                >
                  <Link href={action.href}>
                    {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                    {action.label}
                  </Link>
                </Button>
              );
            }

            return (
              <Button
                key={action.label}
                type="button"
                variant={action.variant === 'secondary' ? 'secondary' : 'primary'}
                size="cta"
                className={className}
                onClick={action.onClick}
              >
                {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                {action.label}
              </Button>
            );
          })}
        </div>

        <div className="bg-secondary-100/85 border-prime-100/80 w-full max-w-3xl rounded-[28px] border px-5 py-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-7">
          <h3 className="text-prime-900 mb-4 text-xl leading-[1.3] font-semibold tracking-[-0.03em]">
            {helpTitle}
          </h3>
          <div className="text-prime-700 space-y-3 text-sm leading-6 sm:text-base">
            {helpItems.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>

          {infoTitle && infoItems?.length ? (
            <div className="mt-7 rounded-2xl border border-white/80 bg-white/70 px-4 py-4">
              <h4 className="text-prime-900 mb-3 text-base leading-[1.3] font-semibold">
                {infoTitle}
              </h4>
              <div className="text-prime-600 space-y-2 text-sm leading-6 sm:text-base">
                {infoItems.map((item) => (
                  <div key={item.label}>
                    <p>
                      <span className="text-prime-800 font-semibold">{item.label}:</span>{' '}
                      {item.value}
                    </p>
                    {item.description ? (
                      <p className="text-prime-500 text-xs sm:text-sm">{item.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
