// ── Figma: Detail Information 컴포넌트 (node 2154:6682) ────────────
// 220×531, 이미지(333px) + 이름/뱃지 + 설명 + 크레딧 + 구매 버튼
// ──────────────────────────────────────────────────────────────────

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { PersonaProduct } from '@/types/persona';

interface PersonaCardProps {
  persona: PersonaProduct;
  onUnlock: (persona: PersonaProduct) => void;
  className?: string;
}

export function PersonaCard({ persona, onUnlock, className }: PersonaCardProps) {
  return (
    <div
      className={cn('flex w-55 flex-col gap-6 items-center', className)}
    >
      {/* 상단: 이미지 + 이름/뱃지 + 설명 + 크레딧 */}
      <div className="flex flex-col gap-4 items-start w-full">
        {/* 이미지 + 텍스트 */}
        <div className="flex flex-col gap-1 items-start w-full">
          {/* 썸네일 이미지 */}
          <div className="relative w-full rounded-lg overflow-hidden" style={{ height: 333 }}>
            <Image
              src={persona.image}
              alt={persona.name}
              fill
              className="object-cover"
            />
          </div>

          {/* 이름 + 해금 뱃지 */}
          <div className="flex items-center justify-between w-full mt-1">
            <h3 className="text-prime-700 text-2xl leading-[1.3] font-semibold tracking-[-0.36px]">
              {persona.name}
            </h3>
            {!persona.isUnlocked && (
              <span className="bg-warning-500 text-inverse text-xs leading-[1.2] font-medium tracking-[-0.18px] rounded-md px-2 py-2 shrink-0">
                해금 필요
              </span>
            )}
            {persona.isUnlocked && (
              <span className="bg-success-500 text-inverse text-xs leading-[1.2] font-medium tracking-[-0.18px] rounded-md px-2 py-2 shrink-0">
                해금 완료
              </span>
            )}
          </div>

          {/* 인용구 + 설명 */}
          <p className="text-prime-700 text-sm leading-[1.6] font-normal w-full">
            {persona.quote}
            <br />
            {persona.description}
          </p>
        </div>

        {/* 크레딧 가격 */}
        <p className="text-success-500 text-2xl leading-[1.3] font-semibold tracking-[-0.36px] whitespace-nowrap">
          {persona.unlockCredits} 크레딧
        </p>
      </div>

      {/* 구매 버튼 */}
      <Button
        variant="primary"
        size="default"
        className="w-full"
        onClick={() => onUnlock(persona)}
        disabled={persona.isUnlocked}
      >
        {persona.isUnlocked ? '사용 중' : '구매하기'}
      </Button>
    </div>
  );
}
