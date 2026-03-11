'use client';

// Figma "페르소나 선택 창[기본]" (node 1887:4701)
// 1200×610, backdrop-blur 15px, bg glass-blue-10, radius 2xl(24px), p-6(24px)
// 페르소나 카드: 220px wide, pill-shape(rounded-full) 이미지, shadow on selected

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogClose,
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
  onPurchase,
}: {
  persona: PersonaCardData;
  isSelected: boolean;
  onSelect: () => void;
  onPurchase?: () => void;
}) {
  // ── 잠긴 페르소나 (미구매) ──
  if (persona.isLocked) {
    return (
      <div className="flex w-55 shrink-0 flex-col gap-4 opacity-50">
        {/* 잠금 플레이스홀더 */}
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
            {persona.name}
          </h4>
          <p className="text-sm leading-[1.6] text-prime-500">
            {persona.description}
          </p>
        </div>
      </div>
    );
  }

  // ── 활성 페르소나 ──
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

  const handleStart = () => {
    if (selectedId) {
      onStart(selectedId);
    }
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
        maxWidth="max-w-[1200px]"
        className="rounded-2xl border-0 bg-[rgba(130,201,255,0.1)] backdrop-blur-[15px]"
      >
        <div className="flex flex-col items-center gap-6">
          {/* ── 헤더: 제목 + 닫기 버튼 ── */}
          <div className="relative flex w-full items-center justify-center">
            <DialogTitle className="text-center text-[32px] leading-[1.3] font-semibold tracking-[-0.48px] text-prime-800">
              원하시는 상담사를 선택해 주세요.
            </DialogTitle>
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:outline-none">
              <X size={32} className="text-prime-800" />
              <span className="sr-only">닫기</span>
            </DialogClose>
          </div>

          {/* ── 페르소나 카드 목록 (가로 스크롤, 구매버튼 절반 노출로 스크롤 유도) ── */}
          <div className="no-scrollbar flex w-full items-start gap-10 overflow-x-auto">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={selectedId === persona.id}
                onSelect={() => setSelectedId(persona.id)}
                onPurchase={handlePurchase}
              />
            ))}
          </div>

          {/* ── CTA 버튼 ── */}
          <Button
            variant="primary"
            size="default"
            className="w-full max-w-89.5"
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
