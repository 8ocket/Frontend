'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreditStore } from '@/entities/credits/store';
import { useAuthStore } from '@/entities/user/store';
import type { ChatBubbleProps } from '@/widgets/chat-main-area';
import type { ChatSessionGroup } from '@/widgets/chat-sidebar';

import {
  ChatMainArea,
  ChatSidebar,
  ChatAlertModal,
  ChatCreditModal,
  ChatNewSessionModal,
  ChatUnfinishedSessionModal,
  // ChatSatisfactionModal,  // TODO: 만족도 조사 — 우선순위 보류
} from '@/components/chat';
import { finalizeToEmotionCardData } from '@/entities/session/utils';
import { EmotionCardFront } from '@/widgets/emotion-card';
import { Menu } from 'lucide-react';
import {
  getActiveSessionApi,
  getSessionsApi,
  getSessionDetailApi,
  finalizeSessionStream,
  deleteSessionApi,
} from '@/entities/session/api';
import { uploadSummaryCardImageApi } from '@/entities/summary';
import { useToast } from '@/shared/ui/toast';
import { getCookie } from '@/shared/lib/utils/cookie';
import type {
  ActiveSessionResponse,
  SessionListItem,
  SessionDetailResponse,
  FinalizeCompleteEvent,
} from '@/entities/session';
import type { EmotionCardData } from '@/entities/emotion';

// ── 모달 상태 타입 ──────────────────────────────────────────────
export type ChatModalType =
  | 'credit-shortage'
  | 'new-session'
  | 'unfinished-session'
  | 'end-confirm'
  // | 'satisfaction'  // TODO: 만족도 조사 — 우선순위 보류
  | null;

// ── 더미 세션 데이터 (TODO: API 연동 시 제거) ───────────────────
type MockSession = {
  id: string;
  messages: ChatBubbleProps[];
};

const _MOCK_SESSIONS: MockSession[] = [
  {
    id: '1',
    messages: [
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content: '안녕하세요. 오늘은 어떤 이야기를 나눠볼까요? 편하게 말씀해 주세요.',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '설 명절에 친척들이 자꾸 취업이나 결혼 얘기를 꺼내서 너무 힘들었어요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content: '그런 상황이 반복되면 정말 지치죠. 특히 어떤 말이 가장 마음에 걸리셨나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '큰아버지가 "너는 언제 자리 잡을 거냐"고 계속 물어보셨는데, 저도 노력 중인데 그 말이 너무 상처가 됐어요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content:
          '충분히 상처받으실 수 있어요. 그 말이 노력을 무시당한 것처럼 느껴지셨을 것 같아요. 지금 본인 페이스대로 잘 하고 계신 거예요.',
      },
    ],
  },
  {
    id: '2',
    messages: [
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content: '안녕하세요! 오늘 어떤 부분이 가장 신경 쓰이세요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '사촌이 대기업에 합격했다고 하니까 자꾸 비교가 되더라고요. 저도 준비 중인데 괜히 주눅이 들어요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content:
          '비교는 자연스러운 감정이지만, 그게 나의 방향까지 흔들면 안 되죠. 지금 내가 가고 싶은 방향이 무엇인지 먼저 정리해볼까요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '저는 IT 쪽 중견기업을 목표로 하고 있어요. 사촌이랑 방향 자체가 달라요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content:
          '맞아요, 서로 다른 길을 가고 있으니 비교 자체가 의미 없어요. 본인의 목표에 집중하는 게 훨씬 효율적이에요.',
      },
    ],
  },
  {
    id: '3',
    messages: [
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '안녕하세요. 오늘 고민이 있으신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '명절에 본가 내려가기가 너무 싫은데, 안 가면 또 눈치가 보여서요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '그 갈등 자체가 이미 꽤 스트레스겠네요. 본가가 힘든 이유가 가족 관계 때문인가요, 아니면 다른 이유도 있나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '가면 꼭 성적이나 취업 얘기가 나오는데 그게 너무 부담이에요. 쉬러 가는 건지 심문받으러 가는 건지 모르겠어요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '그 감정 충분히 이해돼요. 짧게 다녀오면서 화제를 전환할 방법을 미리 준비해 두는 것도 좋은 방법이에요.',
      },
    ],
  },
  {
    id: '4',
    messages: [
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '안녕하세요! 명절 연휴를 어떻게 활용하고 싶으신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '쉬고 싶기도 한데, 연휴 동안 자격증 공부라도 하면 남들보다 앞설 것 같아서 고민이에요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '생산적으로 쓰고 싶은 마음, 충분히 이해해요. 어떤 자격증을 목표로 하고 계세요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          'SQLD나 정보처리기사 쪽을 생각하고 있어요. IT 직군 지원할 때 도움이 될 것 같아서요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '두 자격증 모두 IT 직군 지원 시 실질적으로 도움이 돼요. 다만 하루 2~3시간 정도 적정 분량만 잡는 걸 추천해요.',
      },
    ],
  },
  {
    id: '5',
    messages: [
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '안녕하세요. 면접 관련해서 도움이 필요하신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '네, 면접 볼 때마다 너무 떨려서 준비한 걸 다 못 말하고 나와요. 어떻게 하면 좋을까요?',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '긴장은 누구나 하지만, 그 정도가 지나치면 평소 실력이 안 나오죠. 혹시 긴장이 특히 심해지는 순간이 언제인가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '첫 질문 받을 때요. 자기소개는 잘 하는데 그 다음 예상 못 한 질문이 나오면 머리가 하얘져요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '"핵심 키워드 3개"로 즉흥 답변 구성하는 연습을 해보세요. 모르면 잠깐 생각할 시간을 요청하는 것도 당당한 태도예요.',
      },
    ],
  },
  {
    id: '6',
    messages: [
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content: '안녕하세요. 오늘은 어떤 부분에서 도움이 필요하신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '팀 스터디를 운영하고 있는데 멤버들이 너무 제각각이라 진행이 안 되고 있어요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content:
          '팀 관리가 쉽지 않죠. 구체적으로 어떤 부분이 가장 문제인가요? 참여율인가요, 아니면 방향성인가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '참여율이요. 발표 준비를 안 해오는 사람이 매번 같은 사람이에요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content:
          '"우리 모두 더 잘 되기 위해"라는 방향으로 1대1로 솔직하게 얘기해보는 게 좋아요. 규칙을 문서화하는 것도 도움이 돼요.',
      },
    ],
  },
  {
    id: '7',
    messages: [
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '안녕하세요! 삼성전자 지원을 준비하고 계신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '네, 삼성전자 DS부문 지원하려는데 어떤 스펙이 중요한지 잘 모르겠어요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          'DS부문은 반도체 관련 직군이라 전공 지식이 중요해요. 학점, 전공 프로젝트 경험, 관련 인턴이나 연구실 경험이 핵심이에요. 어떤 전공이세요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '전자공학과예요. 학점은 3.7이고 캡스톤 프로젝트 경험은 있어요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '좋은 조건이에요. GSAT 준비와 영어 성적 관리, 직무 관련 논문이나 특허 경험이 있으면 더욱 차별화될 수 있어요.',
      },
    ],
  },
  {
    id: '8',
    messages: [
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content: '안녕하세요. 요즘 마음이 어떠세요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '번아웃이 온 것 같아요. 아무것도 하기 싫고 침대에만 있고 싶어요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content: '그 감정 정말 힘드셨겠어요. 언제부터 그런 느낌이 시작됐는지 기억하세요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '한 두 달 됐어요. 프로젝트 마감이 연속으로 있었는데 그게 끝나고 나서 오히려 더 무기력해졌어요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content:
          '큰 긴장 상태가 끝난 뒤 찾아오는 무기력감이에요. 오늘 하루 그냥 쉬는 것도 치유의 일부예요. 작은 것부터 천천히 다시 시작하면 돼요.',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '그냥 쉬어도 된다는 말이 이상하게 위로가 돼요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content: '네, 충분히 쉬어도 괜찮아요. 몸과 마음이 회복할 시간이 필요한 거예요.',
      },
    ],
  },
  {
    id: '9',
    messages: [
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content: '안녕하세요. 오늘은 어떤 고민을 가져오셨나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '친한 친구랑 사이가 갑자기 서먹해졌어요. 뭘 잘못한 건지도 모르겠고요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content: '그런 상황이 정말 답답하죠. 서먹해진 계기가 될 만한 일이 있었나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '지난번에 그 친구 고민을 들어줄 때 제가 너무 직설적으로 말했던 것 같아요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content:
          '"요즘 내가 뭔가 실수한 게 있는 것 같아서"라고 부드럽게 물어보는 것도 좋은 시작이에요.',
      },
      { variant: 'user', senderName: '나', content: '먼저 연락하는 게 너무 어렵게 느껴져요.' },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content: '완벽한 말을 준비하려 하지 말고, 진심을 짧게 전달하는 것만으로도 충분해요.',
      },
    ],
  },
  {
    id: '10',
    messages: [
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content: '안녕하세요. 요즘 어떻게 지내고 계세요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '잠을 잘 못 자고 있어요. 새벽에 자꾸 깨고 다시 잠들기가 어려워요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content:
          '수면 문제는 스트레스나 불안과 연결되는 경우가 많아요. 잠에서 깰 때 어떤 생각이 떠오르나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '내일 해야 할 일들이 머릿속에서 계속 돌아가요. 마감이 많아서요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content:
          '자기 전에 할 일을 종이에 적어두는 "브레인 덤프" 방법이 효과적이에요. 머릿속 생각을 종이에 옮기면 뇌가 쉴 수 있어요.',
      },
    ],
  },
  {
    id: '11',
    messages: [
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '안녕하세요! 어떤 고민이 있으신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '복수전공을 할지 말지 고민이에요. 취업에 실제로 도움이 되는지 모르겠어요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '복수전공의 효과는 목표 직무에 따라 달라요. 어떤 분야로 취업을 희망하시나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '데이터 분석 쪽이요. 지금 경영학과인데 컴퓨터공학을 복수전공하려고요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '데이터 분석직군에서 경영+CS 조합은 실제로 경쟁력 있어요. 졸업 시기를 먼저 확인하고 결정하세요.',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '한 학기 더 다녀야 할 수도 있는데 그게 불리하게 작용하지 않을까요?',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '요즘은 졸업 시기보다 스킬셋을 더 중요하게 보는 곳이 많아요. 포트폴리오와 프로젝트 경험이 뒷받침된다면 충분히 설득력 있어요.',
      },
    ],
  },
  {
    id: '12',
    messages: [
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content: '안녕하세요. 오늘 이야기 나눠볼 주제가 있으신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '발표할 때 목소리가 떨리고 사람들 시선이 너무 신경 쓰여요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content: '발표 불안은 매우 흔해요. 어떤 상황에서 가장 심한가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '모르는 사람들 앞에서 더 떨려요. 친한 사람들 앞에선 괜찮은데요.',
      },
      {
        variant: 'ai',
        senderName: '코칭 심리 상담사',
        avatarSrc: '/images/personas/coaching.png',
        content:
          '청중을 "나를 평가하는 사람"이 아니라 "내 이야기를 들으러 온 사람"으로 리프레이밍해보세요. 발표 전 심호흡 4초-유지 4초-내쉬기 4초를 3회 반복하는 것도 효과적이에요.',
      },
    ],
  },
  {
    id: '13',
    messages: [
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content: '안녕하세요. 오늘 어떤 감정을 가져오셨나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '요즘 아무 이유 없이 눈물이 나요. 딱히 슬픈 일도 없는데요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content:
          '이유 없는 눈물은 오히려 마음이 보내는 신호일 수 있어요. 최근에 많이 참거나 억눌렀던 감정이 있었나요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '생각해보니 주변에 힘들다고 말을 못 했던 것 같아요. 항상 괜찮은 척했고요.',
      },
      {
        variant: 'ai',
        senderName: '정신건강 상담사',
        avatarSrc: '/images/personas/mental.png',
        content:
          '오늘 이렇게 꺼내놓으신 것만으로도 정말 잘하신 거예요. 누군가에게 "요즘 좀 힘들어"라고 말하는 연습부터 해보는 건 어떨까요?',
      },
    ],
  },
  {
    id: '14',
    messages: [
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '안녕하세요. 취업 준비 중이신가요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content:
          '포트폴리오를 어떻게 구성해야 할지 모르겠어요. 프로젝트가 없는 것도 아닌데 막막해요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content: '프로젝트가 있다면 충분해요. 어떤 직무를 지원할 예정이에요?',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '프론트엔드 개발자요. React 프로젝트 3개 정도 있어요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '"무엇을 만들었나"보다 "왜 이 기술을 선택했고 어떤 문제를 해결했나"를 중심으로 작성하세요. 문제 상황 → 해결책 → 결과 구조로 정리하면 설득력이 높아요.',
      },
      {
        variant: 'user',
        senderName: '나',
        content: '그 구조대로 다시 써봐야겠네요. 막막했던 게 좀 풀리는 것 같아요.',
      },
      {
        variant: 'ai',
        senderName: '진로 및 학업 상담사',
        avatarSrc: '/images/personas/career.png',
        content:
          '충분히 잘 하고 있어요. 프로젝트 하나씩 그 구조로 정리해보시면 생각보다 빠르게 완성될 거예요.',
      },
    ],
  },
];

const _MOCK_SESSION_GROUPS = [
  {
    date: '2026년 2월 17일',
    sessions: [
      {
        id: '1',
        title: '설날 기간 친척들과의 불편한 이야기',
        avatarSrc: '/images/personas/mental.png',
      },
      {
        id: '2',
        title: '잘 나가는 사촌과 비교 당하지 않기',
        avatarSrc: '/images/personas/coaching.png',
      },
    ],
  },
  {
    date: '2026년 2월 16일',
    sessions: [
      { id: '3', title: '명절기간 본가에 내려가야 하나', avatarSrc: '/images/personas/career.png' },
      { id: '4', title: '명절 기간 동안 스펙쌓기', avatarSrc: '/images/personas/career.png' },
    ],
  },
  {
    date: '2026년 2월 15일',
    sessions: [
      {
        id: '5',
        title: '면접 떨리고 긴장하는 현상 대비',
        avatarSrc: '/images/personas/career.png',
      },
    ],
  },
  {
    date: '2026년 2월 14일',
    sessions: [
      {
        id: '6',
        title: '팀 스터디 효율적인 진행 방식',
        avatarSrc: '/images/personas/coaching.png',
      },
      {
        id: '7',
        title: '삼성전자 직군별 갖춰야 할 스펙',
        avatarSrc: '/images/personas/career.png',
      },
    ],
  },
  {
    date: '2026년 2월 13일',
    sessions: [
      { id: '8', title: '번아웃 극복하기', avatarSrc: '/images/personas/mental.png' },
      { id: '9', title: '친구와의 갑작스러운 거리감', avatarSrc: '/images/personas/coaching.png' },
    ],
  },
  {
    date: '2026년 2월 12일',
    sessions: [
      { id: '10', title: '새벽에 자꾸 깨는 수면 문제', avatarSrc: '/images/personas/mental.png' },
      { id: '11', title: '복수전공 취업에 도움이 될까', avatarSrc: '/images/personas/career.png' },
    ],
  },
  {
    date: '2026년 2월 11일',
    sessions: [
      {
        id: '12',
        title: '발표할 때 목소리 떨림 극복하기',
        avatarSrc: '/images/personas/coaching.png',
      },
    ],
  },
  {
    date: '2026년 2월 10일',
    sessions: [
      { id: '13', title: '이유 없이 눈물이 나는 요즘', avatarSrc: '/images/personas/mental.png' },
      {
        id: '14',
        title: '프론트엔드 포트폴리오 구성 방법',
        avatarSrc: '/images/personas/career.png',
      },
    ],
  },
];

export default function ChatPage() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ChatModalType>(null);
  const openModal = useCallback((type: ChatModalType) => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const { totalCredit } = useCreditStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const remainingCredits = totalCredit;

  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [unfinishedSession, setUnfinishedSession] = useState<ActiveSessionResponse | null>(null);
  const [sessionList, setSessionList] = useState<SessionListItem[]>([]);
  /** 현재 채팅 세션 활성 여부 — false면 입력창 비활성화 */
  const [isSessionActive, setIsSessionActive] = useState(false);
  /** 채팅창에 외부에서 append할 메시지 */
  const [appendMessage, setAppendMessage] = useState<ChatBubbleProps | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetailResponse | null>(null);
  /** finalize 완료 데이터 */
  const [finalizeResult, setFinalizeResult] = useState<FinalizeCompleteEvent | null>(null);
  /** finalize 스트림 취소용 — 언마운트 시 abort */
  const finalizeAbortRef = useRef<AbortController | null>(null);
  /** 감정 카드 앞면 이미지 캡처용 */
  const captureCardRef = useRef<HTMLDivElement>(null);
  const [capturePayload, setCapturePayload] = useState<{
    data: EmotionCardData;
    summaryId: string;
  } | null>(null);
  /** 60분 미입력 자동 종료 타이머 */
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      finalizeAbortRef.current?.abort();
    };
  }, []);

  // finalize 완료 후 감정 카드 앞면 캡처 → PATCH /image 업로드
  useEffect(() => {
    if (!capturePayload) return;
    const { summaryId } = capturePayload;

    const timer = setTimeout(async () => {
      if (!captureCardRef.current) return;
      try {
        const { toBlob } = await import('html-to-image');
        const blob = await toBlob(captureCardRef.current, { pixelRatio: 2 });
        if (!blob) return;
        const file = new File([blob], 'emotion-card.png', { type: 'image/png' });
        await uploadSummaryCardImageApi(summaryId, file);
      } catch {
        // 업로드 실패는 UX에 영향 없음 — 조용히 무시
      } finally {
        setCapturePayload(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [capturePayload]);

  // 채팅 페이지에서는 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 60분 미입력 자동 종료 타이머 — 세션 활성 상태에서만 동작
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(
      () => {
        setIsSessionActive(false);
        finalizeAbortRef.current?.abort();
      },
      60 * 60 * 1000
    );
  }, []);

  useEffect(() => {
    if (isSessionActive) {
      resetInactivityTimer();
    } else {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isSessionActive, resetInactivityTimer]);

  // activeSessionId 변경 시 세션 상세 조회 (새 세션 생성 시에만 — 이어가기/사이드바는 핸들러에서 pre-fetch)
  useEffect(() => {
    if (!activeSessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionDetail(null);
      return;
    }
    // 이미 해당 세션 detail이 로드된 경우 중복 fetch 방지
    if (sessionDetail?.session_id === activeSessionId) return;
    getSessionDetailApi(activeSessionId)
      .then(setSessionDetail)
      .catch(() => setSessionDetail(null));
  }, [activeSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 세션 상세 → ChatBubbleProps[] 변환 (API는 최신→과거 순, 표시는 과거→최신)
  const activeMessages = useMemo((): ChatBubbleProps[] => {
    if (!sessionDetail) return [];
    const messages: ChatBubbleProps[] = [...sessionDetail.messages].reverse().map((m) => ({
      variant: m.role === 'assistant' ? 'ai' : 'user',
      senderName: m.role === 'assistant' ? '나봄이' : (user?.name ?? '나'),
      content: m.content,
      avatarSrc: m.role === 'assistant' ? '/images/personas/nabomi-44.png' : undefined,
      userAvatarSrc: m.role === 'user' ? (user?.profileImage ?? undefined) : undefined,
    }));

    if (sessionDetail.status === 'SAVED' && sessionDetail.card_image_url) {
      messages.push({
        variant: 'ai',
        senderName: '나봄이',
        avatarSrc: '/images/personas/nabomi-44.png',
        cardImageUrl: sessionDetail.card_image_url,
      });
    }

    return messages;
  }, [sessionDetail, user]);

  const activeAiName = '나봄이';
  const activeAiAvatarSrc = '/images/personas/nabomi-44.png';

  // API 세션 목록 → 사이드바용 그룹 데이터로 변환
  const sessionGroups = useMemo((): ChatSessionGroup[] => {
    const groupMap = new Map<string, ChatSessionGroup>();
    for (const s of sessionList) {
      const date = new Date(s.startedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groupMap.has(date)) groupMap.set(date, { date, sessions: [] });
      groupMap.get(date)!.sessions.push({
        id: s.sessionId,
        title: s.title || '제목 없음',
        avatarSrc: '/images/personas/nabomi-21.png',
      });
    }
    return Array.from(groupMap.values());
  }, [sessionList]);

  // ── ?session= 쿼리로 세션 자동 선택 ──────────────────────────────
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      handleSelectSession(sessionId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 진입 시 미완료 세션 확인 + 세션 목록 조회 ──────────────────
  useEffect(() => {
    Promise.all([
      getActiveSessionApi().catch(() => null),
      getSessionsApi().catch(() => null),
    ]).then(([activeSession, sessionData]) => {
      const sessions = sessionData?.sessions ?? [];
      setSessionList(sessions);

      if (activeSession) {
        setUnfinishedSession(activeSession);
        openModal('unfinished-session');
      } else if (sessions.length === 0) {
        openModal('new-session');
      }
    });
  }, [openModal]);

  // ── 핸들러 ───────────────────────────────────────────────────────

  /** 세션 삭제 */
  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSessionApi(id);
      setSessionList((prev) => prev.filter((s) => s.sessionId !== id));
      if (activeSessionId === id) {
        setActiveSessionId(undefined);
        setSessionDetail(null);
      }
      toast('대화가 삭제되었어요.', 'success');
    } catch {
      toast('대화 삭제에 실패했어요.', 'error');
    }
  };

  /** 사이드바 [새로운 상담] 버튼 → 세션 초기화, 입력창 활성화 */
  const handleNewCounsel = () => {
    setSidebarOpen(false);
    closeModal();

    // 오늘 이미 세션이 있으면 추가 상담(70 크레딧 차감) → 크레딧 사전 체크
    const today = new Date().toDateString();
    const hasTodaySession = sessionList.some(
      (s) => new Date(s.startedAt).toDateString() === today
    );
    if (hasTodaySession && totalCredit < 70) {
      openModal('credit-shortage');
      return;
    }

    setActiveSessionId(undefined); // 새 세션 준비 (첫 메시지 전송 시 생성)
    setIsSessionActive(true);
  };

  /** 비활성 입력창/전송 버튼 탭 → [새로운 상담] 안내 모달 (블러 없음) */
  const handleDisabledInputClick = () => {
    openModal('new-session');
  };

  /** [마무리 안된 상담] → 진행한다: 기존 세션 이어가기 */
  const handleUnfinishedResume = async () => {
    closeModal();
    setIsSessionActive(true);
    if (unfinishedSession) {
      // detail 먼저 fetch → sessionDetail 세팅 후 activeSessionId 세팅 (React 18 배칭)
      const detail = await getSessionDetailApi(unfinishedSession.session_id).catch(() => null);
      setSessionDetail(detail);
      setActiveSessionId(unfinishedSession.session_id);
    }
  };

  /** 사이드바 세션 선택: detail 먼저 fetch 후 세션 전환 */
  const handleSelectSession = async (id: string) => {
    const detail = await getSessionDetailApi(id).catch(() => null);
    setSessionDetail(detail);
    setActiveSessionId(id);
    setSidebarOpen(false);
  };

  /** [마무리 안된 상담] → 무시하기: 모달 닫고 입력창 비활성 유지 */
  const handleUnfinishedIgnore = () => {
    closeModal();
    // 입력창은 비활성 유지 → 사이드바 [새로운 상담] 버튼으로 세션 시작 유도
  };

  const handleEndChat = () => openModal('end-confirm');

  /** 종료 확인 → finalize SSE 호출 → 감정 카드 버블 */
  const handleEndConfirmed = async () => {
    closeModal();
    setIsSessionActive(false);
    setAppendMessage({
      variant: 'ai',
      senderName: '나봄이',
      avatarSrc: activeAiAvatarSrc,
      content: '마음 기록을 생성 중입니다.',
    });

    if (!activeSessionId) return;

    // TODO: 만족도 조사 — 우선순위 보류
    // if ((sessionList.length + 1) % 5 === 0) {
    //   openModal('satisfaction');
    // }

    const token = getCookie('accessToken') ?? '';
    if (!token) {
      router.push('/login');
      return;
    }

    const controller = new AbortController();
    finalizeAbortRef.current = controller;

    // onDone 클로저에서 state 참조가 stale해질 수 있으므로 로컬 변수로 캡처
    let capturedResult: typeof finalizeResult = null;
    const capturedSessionId = activeSessionId;

    try {
      await finalizeSessionStream(
        capturedSessionId,
        token,
        () => {}, // status 이벤트 — 고정 메시지 유지
        (data) => {
          setFinalizeResult(data);
          capturedResult = data;
        },
        () => {
          // 만족도 팝업이 열려 있으면 닫기
          closeModal();
          // 텍스트 버블 대신 감정 카드 버블 표시
          if (capturedResult) {
            const cardData = finalizeToEmotionCardData(capturedResult, capturedSessionId);
            setAppendMessage({
              variant: 'ai',
              senderName: '나봄이',
              avatarSrc: activeAiAvatarSrc,
              emotionCardData: cardData,
              cardImageUrl: capturedResult.card_image_url,
            });
            setCapturePayload({ data: cardData, summaryId: capturedResult.summary_id });
          }
        },
        controller.signal,
        (errorMessage) => {
          closeModal();
          console.error('Finalize SSE error:', errorMessage);
          setAppendMessage({ variant: 'ai', senderName: '나봄이', avatarSrc: activeAiAvatarSrc, content: '마음 기록 생성 중 오류가 발생했습니다.' });
        }
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      closeModal();
      const code = err instanceof Error ? err.message : '';
      const message =
        code === 'SESSION_ALREADY_SAVED'
          ? '이미 저장된 상담입니다.'
          : code === 'SESSION_TOO_SHORT'
            ? '상담이 너무 짧아 기록을 생성할 수 없습니다.'
            : code === 'SESSION_NOT_FOUND'
              ? '세션을 찾을 수 없습니다.'
              : '마음 기록 생성에 실패했습니다.';
      setAppendMessage({
        variant: 'ai',
        senderName: '나봄이',
        avatarSrc: activeAiAvatarSrc,
        content: message,
      });
    }
  };

  return (
    <div className="layout-container bg-bg-light relative flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden md:h-[calc(100dvh-5rem)]">
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 — 모바일: 슬라이드 오버레이, 데스크톱: 고정 */}
      <div
        className={`fixed inset-y-0 left-0 z-[60] w-[min(320px,85vw)] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:z-auto lg:w-80.75 lg:translate-x-0 lg:transition-none`}
      >
        <ChatSidebar
          onNewCounsel={handleNewCounsel}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          sessionGroups={sessionGroups}
        />
      </div>

      {/* 메인 채팅 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-black/5">
        {/* 모바일 상담 목록 트리거 (lg 미만에서만 표시) */}
        <div className="border-prime-100 sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-prime-50 text-prime-700 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <Menu className="size-4" />
            상담 목록
          </button>
        </div>
        <ChatMainArea
          onEndChat={handleEndChat}
          onCreditShortage={() => openModal('credit-shortage')}
          onUnfinishedSession={() => openModal('unfinished-session')}
          initialMessages={activeMessages}
          isSessionActive={isSessionActive}
          onDisabledInputClick={handleDisabledInputClick}
          appendMessage={appendMessage}
          sessionId={activeSessionId}
          onSessionCreated={(id) => {
            setActiveSessionId(id);
            setSessionList((prev) => [
              { sessionId: id, title: '', status: 'ACTIVE', startedAt: new Date().toISOString() },
              ...prev,
            ]);
          }}
          aiName={activeAiName}
          aiAvatarSrc={activeAiAvatarSrc}
          onUserMessage={resetInactivityTimer}
          userName={user?.name}
          userAvatarSrc={user?.profileImage}
        />
      </div>

      {/* 크레딧 부족 모달 */}
      <ChatCreditModal
        isOpen={activeModal === 'credit-shortage'}
        onClose={closeModal}
        remainingCredits={remainingCredits}
        onEnd={closeModal}
        onPurchase={() => {
          closeModal();
          router.push('/shop');
        }}
      />

      {/* 새로운 상담 안내 모달 — 블러 없음 */}
      <ChatNewSessionModal
        isOpen={activeModal === 'new-session'}
        onClose={closeModal}
        onConfirm={closeModal}
        overlayBlur={false}
      />

      {/* 미완결 상담 모달 — 블러 있음 */}
      <ChatUnfinishedSessionModal
        isOpen={activeModal === 'unfinished-session'}
        onClose={closeModal}
        sessionTitle={unfinishedSession?.title ?? ''}
        sessionDate={
          unfinishedSession
            ? new Date(unfinishedSession.started_at)
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '. ')
            : ''
        }
        onIgnore={handleUnfinishedIgnore}
        onResume={handleUnfinishedResume}
        overlayBlur
      />

      {/* 상담 종료 확인 모달 */}
      <ChatAlertModal
        isOpen={activeModal === 'end-confirm'}
        onClose={closeModal}
        onWait={closeModal}
        onEnd={handleEndConfirmed}
      />

      {/* TODO: 만족도 조사 — 우선순위 보류 */}
      {/* <ChatSatisfactionModal
        isOpen={activeModal === 'satisfaction'}
        onClose={closeModal}
        onYes={closeModal}
        onNo={closeModal}
      /> */}

      {/* 감정 카드 앞면 이미지 캡처용 — 화면 밖에 숨겨서 렌더링 */}
      {capturePayload && (
        <div
          ref={captureCardRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: 400,
            height: 686,
            pointerEvents: 'none',
          }}
        >
          <EmotionCardFront
            layers={capturePayload.data.layers}
            emotionLabel={(
              capturePayload.data.layers.find((l) => l.role === 'primary')?.type ?? 'emotion'
            ).toUpperCase()}
            width={400}
            height={686}
          />
        </div>
      )}
    </div>
  );
}
