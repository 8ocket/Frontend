'use client';

// Figma "페르소나 선택 창[기본]" (node 1887:4701)
// 1200×610, backdrop-blur 15px, bg glass-blue-10, radius 2xl(24px), p-6(24px)
// 페르소나 카드: 220px wide, pill-shape(rounded-full) 이미지, shadow on selected

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/* ── 타입 ─────────────────────────────────────────────────────── */

export interface PersonaCardData {
  /** 페르소나 ID */
  id: string;
  /** 페르소나 이름 */
  name: string;
  /** 설명 문구 */
  description: string;
  /** 프로필 이미지 URL */
  imageUrl?: string;
  /** 잠금 상태 (미구매) */
  isLocked?: boolean;
}

export interface ChatPersonaSelectModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 페르소나 목록 */
  personas: PersonaCardData[];
  /** 초기 선택 페르소나 ID */
  defaultSelectedId?: string;
  /** AI 상담 시작 (선택된 페르소나 ID 전달) */
  onStart: (personaId: string) => void;
  /** 잠긴 페르소나 구매하기 클릭 */
  onPurchase?: () => void;
}

/* ── 페르소나 카드 ────────────────────────────────────────────── */

function PersonaCard({
  persona,
  isSelected,
  onSelect,
}: {
  persona: PersonaCardData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-55 shrink-0 cursor-pointer flex-col gap-4 transition-opacity',
        isSelected ? 'opacity-100' : 'opacity-50'
      )}
    >
      {/* 프로필 이미지 (pill shape) */}
      <div
        className={cn(
          'relative aspect-220/333 w-full overflow-hidden rounded-full',
          isSelected && 'shadow-[4px_4px_4px_0px_var(--color-prime-300)]'
        )}
      >
        {persona.imageUrl ? (
          <Image
            src={persona.imageUrl}
            alt={persona.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-prime-200" />
        )}
      </div>

      {/* 이름 + 설명 */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h4 className="text-2xl leading-[1.3] font-semibold tracking-[-0.36px] text-prime-700">
          {persona.name}
        </h4>
        <p className="text-sm leading-[1.6] text-prime-600">
          {persona.description}
        </p>
      </div>
    </button>
  );
}

/* ── 구매 유도 카드 ───────────────────────────────────────────── */

function BuyCard({ onPurchase }: { onPurchase?: () => void }) {
  return (
    <div className="flex w-55 shrink-0 flex-col gap-4">
      {/* 구매 플레이스홀더 */}
      <div className="flex aspect-220/333 w-full flex-col items-center justify-center gap-5 rounded-full bg-[rgba(130,201,255,0.2)]">
        <div className="flex h-12 w-12 items-center justify-center">
          <span className="text-3xl text-prime-400">?</span>
        </div>
        <div className="flex flex-col items-center gap-2 px-6">
          <p className="whitespace-pre-wrap text-center text-sm leading-[1.6] text-prime-900">
            {'새로운 페르소나를\n구매하시겠어요?'}
          </p>
          <Button
            variant="secondary"
            size="default"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onPurchase?.();
            }}
          >
            구매하러 가기
          </Button>
        </div>
      </div>

      {/* 이름 + 설명 */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h4 className="text-2xl leading-[1.3] font-semibold tracking-[-0.36px] text-prime-500">
          새로운 페르소나
        </h4>
        <p className="text-sm leading-[1.6] text-prime-500">
          페르소나를 해금하여 더 많은 방식의 상담을 진행해 보세요.
        </p>
      </div>
    </div>
  );
}

/* ── 페르소나 선택 모달 ──────────────────────────────────────── */

export function ChatPersonaSelectModal({
  isOpen,
  onClose,
  personas,
  defaultSelectedId,
  onStart,
  onPurchase,
}: ChatPersonaSelectModalProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultSelectedId ?? null
  );

  // 보유 페르소나 / 구매 가능 여부 분리
  const ownedPersonas = personas.filter((p) => !p.isLocked);
  const hasBuySlot = personas.some((p) => p.isLocked);
  const totalItems = ownedPersonas.length + (hasBuySlot ? 1 : 0);

  // 4개 초과 시 스크롤 활성화
  const needsScroll = totalItems > 4;

  const handleStart = () => {
    if (selectedId) onStart(selectedId);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedId(defaultSelectedId ?? null);
      onClose();
    }
  };

  const handlePurchase = () => {
    onPurchase?.();
    router.push('/shop');
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose={false}
        maxWidth={needsScroll ? 'max-w-[1200px]' : 'max-w-[1060px]'}
        className="rounded-2xl border-0 bg-[rgba(130,201,255,0.1)] backdrop-blur-[15px]"
      >
        <div className="flex flex-col items-center gap-6">
          {/* ── 헤더: 제목 ── */}
          <DialogTitle className="text-center text-[32px] leading-[1.3] font-semibold tracking-[-0.48px] text-prime-800">
            원하시는 상담사를 선택해 주세요.
          </DialogTitle>

          {/* ── 페르소나 카드 목록 ── */}
          <div className="relative w-full">
            <div
              className={cn(
                'flex w-full items-start gap-10',
                needsScroll ? 'no-scrollbar overflow-x-auto' : 'justify-center'
              )}
            >
              {ownedPersonas.map((persona) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  isSelected={selectedId === persona.id}
                  onSelect={() => setSelectedId(persona.id)}
                />
              ))}
              {hasBuySlot && <BuyCard onPurchase={handlePurchase} />}
            </div>

            {/* 스크롤 유도 화살표 (5개 이상일 때) */}
            {needsScroll && (
              <div className="pointer-events-none absolute right-0 top-0 flex h-full items-center">
                <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-r from-transparent to-[rgba(130,201,255,0.25)]" />
                <ChevronRight
                  size={28}
                  className="relative z-10 text-prime-400 drop-shadow-sm"
                />
              </div>
            )}
          </div>

          {/* ── CTA 버튼 ── */}
          <Button
            variant="primary"
            size="default"
            className="w-full max-w-89.5 px-6"
            onClick={handleStart}
            disabled={!selectedId}
          >
            AI 상담 시작하기
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
