'use client';

// Figma "페르소나 선택 창[기본]" (node 1643:3357 > child[18])
// 1200×610, VERTICAL layout, gap 10, padding H24/V24
// bg: rgba(130,201,255,0.10), BACKGROUND_BLUR radius:30, radius:24

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

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

// Figma AI Persona Button (INSTANCE) — 220×428, VERTICAL, gap 16
// 비선택: opacity 변화 없음
// 선택: 이미지에 DROP_SHADOW offset(4,4) radius:4 color:#ABB9CF
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
      className="flex w-55 shrink-0 cursor-pointer flex-col gap-4 transition-opacity"
    >
      {/* 이미지 — 220×333, radius 9999 (pill)
          선택 시: DROP_SHADOW 4px 4px 4px #ABB9CF */}
      <div
        className="relative aspect-220/333 w-full overflow-hidden rounded-full"
        style={isSelected ? { boxShadow: '4px 4px 4px 0px #ABB9CF' } : undefined}
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

      {/* 텍스트 — Frame 220×79, VERTICAL, gap 4, cross CENTER */}
      <div className="flex flex-col items-center gap-1 text-center">
        {/* 이름 — Pretendard 24px/600, lh 31.2px, #3F526F */}
        <h4
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '31.2px',
            color: 'var(--color-prime-700)',
          }}
        >
          {persona.name}
        </h4>
        {/* 설명 — Pretendard 14px/400, lh 22.4px, #516A90 */}
        <p
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '22.4px',
            color: 'var(--color-prime-600)',
          }}
        >
          {persona.description}
        </p>
      </div>
    </button>
  );
}

/* ── 구매 유도 카드 ───────────────────────────────────────────── */

// Figma: 220×428, VERTICAL gap 16
// 이미지 영역: 220×333, radius 9999, bg rgba(130,201,255,0.20)
function BuyCard({ onPurchase }: { onPurchase?: () => void }) {
  return (
    <div className="flex w-55 shrink-0 flex-col gap-4">
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

      <div className="flex flex-col items-center gap-1 text-center">
        <h4
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '31.2px',
            color: 'var(--color-prime-700)',
          }}
        >
          새로운 페르소나
        </h4>
        <p
          style={{
            fontFamily: 'var(--font-pretendard)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '22.4px',
            color: 'var(--color-prime-600)',
          }}
        >
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
      {/* 컨테이너 — 1200×610, VERTICAL gap:10, padding H24/V24
          bg: rgba(130,201,255,0.10), BACKGROUND_BLUR radius:30, radius:24 */}
      <DialogContent
        showClose={false}
        maxWidth={needsScroll ? 'max-w-[1200px]' : 'max-w-[1060px]'}
        className="rounded-3xl border-0 bg-[rgba(130,201,255,0.1)] p-6 backdrop-blur-[30px]"
      >
        {/* Frame 1597882316 — VERTICAL, gap 24, cross CENTER */}
        <div className="flex flex-col items-center gap-6">

          {/* Frame 1597882315 — VERTICAL, gap 24, cross MAX */}
          <div className="flex w-full flex-col gap-6">

            {/* Frame 1597882306 (헤더) — HORIZONTAL, SPACE_BETWEEN, cross CENTER, 755×42 */}
            <div className="flex w-full items-center justify-between">
              {/* Frame 1597881475 — 제목 프레임, VERTICAL gap:16, primary CENTER, cross CENTER */}
              <DialogTitle
                style={{
                  fontFamily: 'var(--font-pretendard)',
                  fontSize: '32px',
                  fontWeight: 600,
                  lineHeight: '41.6px',
                  color: 'var(--color-prime-800)',
                }}
              >
                원하시는 상담사를 선택해 주세요.
              </DialogTitle>

              {/* 닫기 버튼 — Frame 32×32, bg transparent, X Vector 13×13 #3F526F */}
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center"
                aria-label="닫기"
              >
                <X size={13} color="#3F526F" />
              </button>
            </div>

            {/* 카드 목록 — Frame 1597882314, HORIZONTAL, gap 40, primary CENTER, cross CENTER */}
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

              {/* 스크롤 유도 화살표 (5개 이상) */}
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
          </div>

          {/* CTA 버튼 — Button 358×44, bg cta-300, Pretendard 16px/500, text prime-900
              padding H24/V14, radius 8 */}
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
