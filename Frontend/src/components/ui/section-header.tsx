import React, { HTMLAttributes } from 'react';

interface SectionHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3';
}

export function SectionHeader({
  children,
  level = 'h2',
  className,
  ...props
}: SectionHeaderProps) {
  const HeadingComponent = level;
  const baseClass =
    level === 'h1'
      ? 'text-3xl'
      : level === 'h2'
        ? 'text-xl'
        : 'text-lg';

  return (
    <HeadingComponent
      className={`${baseClass} text-prime-800 dark:text-secondary-100 leading-[1.3] font-semibold tracking-[-0.3px] ${className || ''}`}
      {...props}
    >
      {children}
    </HeadingComponent>
  );
}
