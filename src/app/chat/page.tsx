'use client';

import { useState } from 'react';

import {
  ChatMainArea,
  ChatSidebar,
  ChatAlertModal,
  ChatCreditModal,
  ChatNewSessionModal,
  ChatUnfinishedSessionModal,
  ChatRecordLoadingModal,
  ChatPersonaSelectModal,
  ChatPersonaConfirmModal,
  type PersonaCardData,
} from '@/components/chat';
import { Menu } from 'lucide-react';

// ── 모달 상태 타입 ──────────────────────────────────────────────
export type ChatModalType =
  | 'persona-select'
  | 'persona-confirm'
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
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openModal = (type: ChatModalType) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const handleNewCounsel = () => {
    setSidebarOpen(false);
    // TODO: 미완결 상담 체크 API → 있으면 'unfinished-session', 없으면 'persona-select'
    openModal('persona-select');
  };

  const handlePersonaStart = (personaId: string) => {
    setSelectedPersonaId(personaId);
    openModal('persona-confirm');
  };

  const handlePersonaConfirm = () => {
    closeModal();
    if (remainingCredits <= 0) {
      openModal('credit-shortage');
      return;
    }
    // TODO: 세션 생성 API 호출 (selectedPersonaId)
  };

  const handlePersonaReselect = () => {
    openModal('persona-select');
  };

  const handleEndChat = () => openModal('end-confirm');

  const handleConfirmEnd = () => {
    closeModal();
    openModal('record-loading');
  };

  return (
    <div className="relative flex h-[calc(100dvh-4rem)] overflow-hidden md:h-[calc(100dvh-5rem)] lg:gap-10.75 lg:px-60">
      {/* 모바일 사이드바 토글 버튼 */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="bg-secondary-100/80 dark:bg-prime-900/80 absolute top-3 left-3 z-30 flex h-10 w-10 items-center justify-center rounded-lg shadow-md backdrop-blur-sm lg:hidden"
        aria-label="상담 목록 열기"
      >
        <Menu size={20} />
      </button>

      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 — 모바일: 슬라이드 오버레이, 데스크톱: 고정 */}
      <div
        className={`dark:bg-prime-900 fixed inset-y-0 left-0 z-40 w-[min(320px,85vw)] transform bg-white pt-16 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:z-auto lg:w-80.75 lg:translate-x-0 lg:bg-transparent lg:pt-0 lg:transition-none dark:lg:bg-transparent`}
      >
        <ChatSidebar onNewCounsel={handleNewCounsel} />
      </div>

      {/* 메인 채팅 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden pt-14 lg:pt-0">
        <ChatMainArea
          onEndChat={handleEndChat}
          onCreditShortage={() => openModal('credit-shortage')}
          onUnfinishedSession={() => openModal('unfinished-session')}
        />
      </div>

      {/* 페르소나 선택 모달 */}
      <ChatPersonaSelectModal
        isOpen={activeModal === 'persona-select'}
        onClose={closeModal}
        personas={MOCK_PERSONAS}
        onStart={handlePersonaStart}
        onPurchase={closeModal}
      />

      {/* 페르소나 확인 모달 */}
      <ChatPersonaConfirmModal
        isOpen={activeModal === 'persona-confirm'}
        onClose={closeModal}
        onReselect={handlePersonaReselect}
        onConfirm={handlePersonaConfirm}
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
        onIgnore={() => {
          closeModal();
          openModal('persona-select');
        }}
        onResume={closeModal}
      />

      {/* 상담 종료 확인 모달 */}
      {activeModal === 'end-confirm' && (
        <ChatAlertModal variant="end" onWait={closeModal} onEnd={handleConfirmEnd} />
      )}

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
