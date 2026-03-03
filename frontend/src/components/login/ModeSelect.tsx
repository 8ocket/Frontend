/**
 * 다크 모드 선택 버튼 컴포넌트
 */

import { loginTexts } from '@/constants/login';

interface ModeSelectProps {
  onClick?: () => void;
  className?: string;
}

export function ModeSelect({ onClick, className = '' }: ModeSelectProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[44px] items-center justify-center rounded-[8px] bg-[#1a222e] px-[16px] py-[8px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 ${className} `}
      data-testid="mode-select-button"
    >
      <span className="text-[16px] leading-[1.3] font-semibold tracking-tight">
        {loginTexts.darkModeSelect}
      </span>
    </button>
  );
}
