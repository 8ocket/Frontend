'use client';

import { useState } from 'react';

import {
  ChatCreditModal,
  ChatNewSessionModal,
  ChatUnfinishedSessionModal,
  ChatRecordLoadingModal,
  ChatPersonaSelectModal,
  type PersonaCardData,
} from '@/components/chat';
import { StatusModal } from '@/shared/ui/status-modal';

const MOCK_PERSONAS: PersonaCardData[] = [
  {
    id: 'mental',
    name: '정신건강 상담사',
    description: '감정 소진, 불안, 우울감 등 정서적 케어와 공감에 집중',
  },
  {
    id: 'career',
    name: '진로 및 학업 상담사',
    description: '목표 설정, 번아웃 관리, 진로 탐색 등 성취와 관련된 고민 구조화',
  },
  {
    id: 'coaching',
    name: '코칭 심리 상담사',
    description:
      '대인관계, 의사소통 일상적 스트레스 관리 등 실질적인 행동 변화와 솔루션 제안',
  },
  {
    id: 'locked-1',
    name: '새로운 페르소나',
    description: '페르소나를 해금하여 더 많은 방식의 상담을 진행해 보세요.',
    isLocked: true,
  },
  {
    id: 'locked-2',
    name: '새로운 페르소나',
    description: '페르소나를 해금하여 더 많은 방식의 상담을 진행해 보세요.',
    isLocked: true,
  },
];

type ModalKey =
  | 'credit'
  | 'new-session'
  | 'unfinished'
  | 'record-loading'
  | 'persona-select'
  | 'end-confirm'
  | null;

const MODAL_LIST: { key: ModalKey; label: string; semantic: string }[] = [
  { key: 'credit', label: '크레딧 부족', semantic: '🔴 Red' },
  { key: 'new-session', label: '새로운 상담 안내', semantic: '🟡 Yellow' },
  { key: 'unfinished', label: '미완결 상담', semantic: '🟡 Yellow' },
  { key: 'end-confirm', label: '상담 종료 확인', semantic: '🔴 Red (StatusModal)' },
  { key: 'record-loading', label: '마음기록 제작 대기', semantic: '🔵 Blue + Spinner' },
  { key: 'persona-select', label: '페르소나 선택', semantic: '🌫️ Glass (대형)' },
];

export default function ModalDemoPage() {
  const [active, setActive] = useState<ModalKey>(null);
  const close = () => setActive(null);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-prime-900">
        🧪 Modal 데모
      </h1>
      <p className="mb-8 text-prime-600">
        버튼을 눌러 각 모달을 테스트해 보세요. ESC 또는 오버레이 클릭으로 닫을 수 있습니다.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {MODAL_LIST.map(({ key, label, semantic }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className="flex flex-col gap-1 rounded-xl border-2 border-neutral-300 bg-secondary-100 p-4 text-left transition-colors hover:border-cta-300 hover:bg-cta-100"
          >
            <span className="text-base font-semibold text-prime-900">{label}</span>
            <span className="text-sm text-tertiary-400">{semantic}</span>
          </button>
        ))}
      </div>

      {/* ── 모달들 ── */}

      <ChatCreditModal
        isOpen={active === 'credit'}
        onClose={close}
        remainingCredits={0}
        onEnd={() => { close(); alert('종료하기 클릭'); }}
        onPurchase={() => { close(); alert('구매하기 클릭'); }}
      />

      <ChatNewSessionModal
        isOpen={active === 'new-session'}
        onClose={close}
        onConfirm={() => { close(); alert('확인 클릭'); }}
      />

      <ChatUnfinishedSessionModal
        isOpen={active === 'unfinished'}
        onClose={close}
        sessionTitle="설날 기간 친척들과의 불편한 이야기"
        sessionDate="2026. 02. 17"
        onIgnore={() => { close(); alert('무시한다 클릭'); }}
        onResume={() => { close(); alert('진행한다 클릭'); }}
      />

      <ChatRecordLoadingModal
        isOpen={active === 'record-loading'}
        onClose={close}
        onWait={() => { close(); alert('대기한다 클릭'); }}
        onExit={() => { close(); alert('종료하기 클릭'); }}
      />

      <ChatPersonaSelectModal
        isOpen={active === 'persona-select'}
        onClose={close}
        personas={MOCK_PERSONAS}
        defaultSelectedId="career"
        onStart={(id) => { close(); alert(`상담 시작: ${id}`); }}
        onPurchase={() => { close(); alert('구매하러 가기 클릭'); }}
      />

      <StatusModal
        isOpen={active === 'end-confirm'}
        onClose={close}
        semantic="warning"
        title="상담이 종료됩니다."
        description="현재까지 상담한 내역들을 정리하여 리포트로 만듭니다. 현재 화면을 벗어나더라도 리포트는 자동으로 만들어집니다."
        actions={[
          {
            label: '상담내역 확인',
            variant: 'secondary',
            semantic: 'red',
            onClick: () => { close(); alert('상담내역 확인 클릭'); },
          },
          {
            label: '종료하기',
            variant: 'primary',
            onClick: () => { close(); alert('종료하기 클릭'); },
          },
        ]}
      />
    </div>
  );
}
