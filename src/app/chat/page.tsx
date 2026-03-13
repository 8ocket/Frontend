'use client';

import { useState } from 'react';

import {
  ChatMainArea,
  ChatSidebar,
  ChatCreditModal,
  ChatNewSessionModal,
  ChatUnfinishedSessionModal,
  ChatRecordLoadingModal,
  ChatPersonaSelectModal,
  type PersonaCardData,
} from '@/components/chat';
import { StatusModal } from '@/components/ui/status-modal';

// ── 모달 상태 타입 ──────────────────────────────────────────────
export type ChatModalType =
  | 'persona-select'
  | 'credit-shortage'
  | 'new-session'
  | 'unfinished-session'
  | 'end-confirm'
  | 'record-loading'
  | null;

// ── 샘플 페르소나 데이터 (TODO: API 연동 시 제거) ───────────────
const MOCK_PERSONAS: PersonaCardData[] = [
  {
    id: 'mental',
    name: '정신건강 상담사',
    description: '감정 소진, 불안, 우울감 등 정서적 케어와 공감에 집중',
    imageUrl: '/images/personas/mental.png',
  },
  {
    id: 'career',
    name: '진로 및 학업 상담사',
    description: '목표 설정, 번아웃 관리, 진로 탐색 등 성취와 관련된 고민 구조화',
    imageUrl: '/images/personas/career.png',
  },
  {
    id: 'coaching',
    name: '코칭 심리 상담사',
    description: '대인관계, 의사소통 일상적 스트레스 관리 등 실질적인 행동 변화와 솔루션 제안',
    imageUrl: '/images/personas/coaching.png',
  },
  {
    id: 'locked-1',
    name: '새로운 페르소나',
    description: '페르소나를 해금하여 더 많은 방식의 상담을 진행해 보세요.',
    isLocked: true,
  },
];

export default function ChatPage() {
  const [activeModal, setActiveModal] = useState<ChatModalType>(null);
  const [remainingCredits] = useState(0); // TODO: 실제 크레딧 조회 연동

  const openModal = (type: ChatModalType) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const handleNewCounsel = () => {
    // TODO: 미완결 상담 체크 API → 있으면 'unfinished-session', 없으면 'persona-select'
    openModal('persona-select');
  };

  const handlePersonaStart = (personaId: string) => {
    closeModal();
    // TODO: 크레딧 확인 → 부족하면 openModal('credit-shortage')
    // TODO: 세션 생성 API 호출 (personaId)
  };

  const handleEndChat = () => openModal('end-confirm');

  const handleConfirmEnd = () => {
    closeModal();
    openModal('record-loading');
  };

  return (
    // GNB는 layout.tsx에서 전역 렌더링 — 여기서는 콘텐츠 영역만
    // 1920px 기준: 좌우 240px 패딩, gap 43px, 하단 116px
    <div className="flex h-[calc(100vh-80px)] gap-10.75 overflow-hidden px-60">
      <ChatSidebar onNewCounsel={handleNewCounsel} />
      <ChatMainArea
        onEndChat={handleEndChat}
        onCreditShortage={() => openModal('credit-shortage')}
        onUnfinishedSession={() => openModal('unfinished-session')}
      />

      {/* 페르소나 선택 모달 */}
      <ChatPersonaSelectModal
        isOpen={activeModal === 'persona-select'}
        onClose={closeModal}
        personas={MOCK_PERSONAS}
        onStart={handlePersonaStart}
        onPurchase={closeModal}
      />

      {/* 크레딧 부족 모달 */}
      <ChatCreditModal
        isOpen={activeModal === 'credit-shortage'}
        onClose={closeModal}
        remainingCredits={remainingCredits}
        onEnd={closeModal}
        onPurchase={closeModal}
      />

      {/* 새로운 상담 안내 모달 */}
      <ChatNewSessionModal
        isOpen={activeModal === 'new-session'}
        onClose={closeModal}
        onConfirm={closeModal}
      />

      {/* 미완결 상담 모달 */}
      <ChatUnfinishedSessionModal
        isOpen={activeModal === 'unfinished-session'}
        onClose={closeModal}
        sessionTitle="설날 기간 친척들과의 불편한 이야기"
        sessionDate="2026. 02. 17"
        onIgnore={() => { closeModal(); openModal('persona-select'); }}
        onResume={closeModal}
      />

      {/* 상담 종료 확인 모달 */}
      <StatusModal
        isOpen={activeModal === 'end-confirm'}
        onClose={closeModal}
        semantic="warning"
        title="상담이 종료됩니다."
        description="현재까지 상담한 내역들을 정리하여 리포트로 만듭니다. 현재 화면을 벗어나더라도 리포트는 자동으로 만들어집니다."
        actions={[
          { label: '상담내역 확인', variant: 'secondary', semantic: 'red', onClick: closeModal },
          { label: '종료하기', variant: 'primary', onClick: handleConfirmEnd },
        ]}
      />

      {/* 마음기록 제작 대기 모달 */}
      <ChatRecordLoadingModal
        isOpen={activeModal === 'record-loading'}
        onClose={closeModal}
        onWait={closeModal}
        onExit={closeModal}
      />
    </div>
  );
}
