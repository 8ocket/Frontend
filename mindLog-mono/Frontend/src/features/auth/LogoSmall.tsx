import Image from 'next/image';
import { loginImages } from '@/constants/login';

interface LogoSmallProps {
  readonly className?: string;
}

export function LogoSmall({ className = '' }: LogoSmallProps) {
  return (
    <div className={`relative ${className}`} data-testid="logo-small">
      <Image
        src={loginImages.logo}
        alt="MindLog Logo"
        width={295}
        height={295}
        priority
        className="h-auto w-full"
      />
    </div>
  );
}
