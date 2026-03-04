'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Figma 이미지 assets
const imgFrame = 'https://www.figma.com/api/mcp/asset/7bc19b81-69ee-4b0f-af98-b6f5a776d983';
const imgWave = 'https://www.figma.com/api/mcp/asset/e2d936b1-30e5-4dfd-8b0c-89e46c1fd873';

export interface ConditionsProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAgree?: () => void;
}

/**
 * Checkbox 컴포넌트
 */
function Checkbox({
  checked = false,
  onChange,
  className = '',
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-300 transition-all ${checked ? 'bg-cta-300' : 'bg-secondary-100'} ${className} `}
    >
      {checked && <span className="text-secondary-100 text-xs font-semibold">✓</span>}
    </button>
  );
}

/**
 * Conditions 모달 컴포넌트
 * "만 14세 이상 이용 확인" 약관 동의 모달
 */
export function Conditions({ isOpen = true, onClose, onAgree }: ConditionsProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    if (isChecked) {
      onAgree?.();
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative w-full max-w-lg">
        {/* 배경 블라우 효과가 있는 컨테이너 */}
        <div className="bg-secondary-100/30 flex flex-col gap-2.5 rounded-2xl p-6 backdrop-blur-xl">
          {/* 헤더: 제목 + 닫기 버튼 */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-prime text-3xl leading-tight font-semibold">
              만 14세 이상 이용 확인
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center text-2xl transition hover:opacity-70"
            >
              <img src={imgFrame} alt="close" className="h-full w-full" />
            </button>
          </div>

          {/* 본문: 스크롤 가능한 약관 내용 */}
          <div className="flex max-h-96 items-start gap-2.5 overflow-y-auto">
            {/* 텍스트 영역 */}
            <div className="flex-1">
              <p className="text-prime-700 text-sm leading-relaxed whitespace-pre-wrap">
                {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`}
              </p>
            </div>

            {/* 스크롤 바 (데코레이션) */}
            <div className="bg-cta-300/10 relative w-4 flex-shrink-0 rounded-full">
              <div className="bg-cta-300/30 absolute top-0 right-0 h-20 w-4 rounded-full" />
            </div>
          </div>

          {/* 동의 버튼: 하단 고정 */}
          <div className="mt-6 border-t border-neutral-300 pt-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-prime text-base font-medium">동의하기</span>
            </div>
          </div>

          {/* CTA 버튼 */}
          <Button
            onClick={handleAgree}
            disabled={!isChecked}
            variant="primary"
            size="cta"
            className="mt-4 w-full rounded-full"
          >
            동의하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Conditions;
