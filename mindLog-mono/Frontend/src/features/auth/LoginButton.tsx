import Image from 'next/image';
import { loginColors, loginImages, loginTexts } from '@/constants/login';

export type LoginProvider = 'kakao' | 'naver' | 'google';

interface LoginButtonProps {
  readonly provider: LoginProvider;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly isLoading?: boolean;
}

const providerConfig: Record<
  LoginProvider,
  {
    label: keyof typeof loginTexts;
    bgColor: string;
    textColor: string;
    borderColor?: string;
    icon: string;
  }
> = {
  kakao: {
    label: 'kakaoButton',
    bgColor: loginColors.kakao,
    textColor: 'text-[#1a222e]',
    icon: loginImages.kakaoIcon,
  },
  naver: {
    label: 'naverButton',
    bgColor: loginColors.naver,
    textColor: 'text-white',
    icon: loginImages.naverIcon,
  },
  google: {
    label: 'googleButton',
    bgColor: 'white',
    textColor: 'text-[#1a222e]',
    borderColor: '#acb4bb',
    icon: loginImages.googleIcon,
  },
};

export function LoginButton({
  provider,
  onClick,
  disabled = false,
  isLoading = false,
}: LoginButtonProps) {
  const config = providerConfig[provider];
  const borderClass = provider === 'google' ? 'border border-[#acb4bb] border-solid' : '';
  const bgClass = provider === 'google' ? 'bg-white' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl px-6 py-2 font-medium transition-opacity duration-200 ${borderClass} ${bgClass} disabled:opacity-50 ${!borderClass ? 'text-white' : ''} ${config.textColor}`}
      style={{
        backgroundColor: provider !== 'google' ? config.bgColor : undefined,
        borderColor: provider === 'google' ? config.borderColor : 'transparent',
      }}
      data-testid={`login-button-${provider}`}
    >
      <Image
        src={config.icon}
        alt={`${provider} icon`}
        width={provider === 'kakao' ? 20 : provider === 'naver' ? 16 : 19}
        height={provider === 'kakao' ? 18 : provider === 'naver' ? 17 : 20}
        className="h-6 w-6"
      />
      <span className="text-[16px] leading-none font-medium tracking-tight">
        {loginTexts[config.label]}
      </span>
    </button>
  );
}
