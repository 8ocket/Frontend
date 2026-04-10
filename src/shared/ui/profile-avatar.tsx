'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface ProfileAvatarProps {
  src?: string | null;
  size?: number;
  className?: string;
  defaultPadding?: string;
}

function DefaultProfileIcon({ padding }: { padding: string }) {
  return (
    <div className={cn('absolute inset-0 flex items-center justify-center', padding)}>
      <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 8C9.933 8 11.5 6.433 11.5 4.5C11.5 2.567 9.933 1 8 1C6.067 1 4.5 2.567 4.5 4.5C4.5 6.433 6.067 8 8 8Z"
          fill="#2b4764"
        />
        <path
          d="M8 9.5C4.686 9.5 2 11.01 2 12.875V14H14V12.875C14 11.01 11.314 9.5 8 9.5Z"
          fill="#2b4764"
        />
      </svg>
    </div>
  );
}

export function ProfileAvatar({
  src,
  size,
  className,
  defaultPadding = 'p-2',
}: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const isDefault = !src || imgError;

  if (isDefault) {
    return <DefaultProfileIcon padding={defaultPadding} />;
  }

  return (
    <Image
      src={src}
      alt="프로필"
      fill={!size}
      width={size}
      height={size}
      className={cn('object-cover', className)}
      onError={() => setImgError(true)}
    />
  );
}
