'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

const DEFAULT_PROFILE = '/images/icons/profile-default.png';

interface ProfileAvatarProps {
  src?: string | null;
  size?: number;
  className?: string;
  defaultPadding?: string;
}

export function ProfileAvatar({
  src,
  size,
  className,
  defaultPadding = 'p-2',
}: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const isDefault = !src || src === DEFAULT_PROFILE || imgError;
  const imgSrc = isDefault ? DEFAULT_PROFILE : src;

  if (isDefault) {
    return (
      <div className={cn('absolute inset-0', defaultPadding)}>
        <Image
          src={imgSrc}
          alt="프로필"
          fill
          className="object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt="프로필"
      fill={!size}
      width={size}
      height={size}
      className={cn('object-cover', className)}
      onError={() => setImgError(true)}
    />
  );
}
