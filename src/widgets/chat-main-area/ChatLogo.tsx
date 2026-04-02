'use client';

// Figma 1382:2757 — LOGO (INSTANCE), 884×884
// logo-small.svg 재사용 (295×295 → size prop으로 스케일)

import Image from 'next/image';

type ChatLogoProps = {
  size?: number;
  className?: string;
};

export function ChatLogo({ size = 884, className = '' }: ChatLogoProps) {
  return (
    <Image
      src="/images/logo/logo-small.svg"
      width={size}
      height={size}
      alt=""
      className={className}
      aria-hidden="true"
    />
  );
}
