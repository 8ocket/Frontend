'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/store';
import { useChatModals } from '@/features/select-persona';
import type { ChatBubbleProps } from '@/widgets/chat-main-area';
import type { ChatSessionGroup } from '@/widgets/chat-sidebar';

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

// ── 더미 세션 데이터 (TODO: API 연동 시 제거) ───────────────────
type MockSession = {
  id: string;
  messages: ChatBubbleProps[];
};

const MOCK_SESSIONS: MockSession[] = [
  {
    id: '1',
    messages: [
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '안녕하세요. 오늘은 어떤 이야기를 나눠볼까요? 편하게 말씀해 주세요.' },
      { variant: 'user', senderName: '나', content: '설 명절에 친척들이 자꾸 취업이나 결혼 얘기를 꺼내서 너무 힘들었어요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '그런 상황이 반복되면 정말 지치죠. 특히 어떤 말이 가장 마음에 걸리셨나요?' },
      { variant: 'user', senderName: '나', content: '큰아버지가 "너는 언제 자리 잡을 거냐"고 계속 물어보셨는데, 저도 노력 중인데 그 말이 너무 상처가 됐어요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '충분히 상처받으실 수 있어요. 그 말이 노력을 무시당한 것처럼 느껴지셨을 것 같아요. 지금 본인 페이스대로 잘 하고 계신 거예요.' },
    ],
  },
  {
    id: '2',
    messages: [
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '안녕하세요! 오늘 어떤 부분이 가장 신경 쓰이세요?' },
      { variant: 'user', senderName: '나', content: '사촌이 대기업에 합격했다고 하니까 자꾸 비교가 되더라고요. 저도 준비 중인데 괜히 주눅이 들어요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '비교는 자연스러운 감정이지만, 그게 나의 방향까지 흔들면 안 되죠. 지금 내가 가고 싶은 방향이 무엇인지 먼저 정리해볼까요?' },
      { variant: 'user', senderName: '나', content: '저는 IT 쪽 중견기업을 목표로 하고 있어요. 사촌이랑 방향 자체가 달라요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '맞아요, 서로 다른 길을 가고 있으니 비교 자체가 의미 없어요. 본인의 목표에 집중하는 게 훨씬 효율적이에요.' },
    ],
  },
  {
    id: '3',
    messages: [
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '안녕하세요. 오늘 고민이 있으신가요?' },
      { variant: 'user', senderName: '나', content: '명절에 본가 내려가기가 너무 싫은데, 안 가면 또 눈치가 보여서요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '그 갈등 자체가 이미 꽤 스트레스겠네요. 본가가 힘든 이유가 가족 관계 때문인가요, 아니면 다른 이유도 있나요?' },
      { variant: 'user', senderName: '나', content: '가면 꼭 성적이나 취업 얘기가 나오는데 그게 너무 부담이에요. 쉬러 가는 건지 심문받으러 가는 건지 모르겠어요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '그 감정 충분히 이해돼요. 짧게 다녀오면서 화제를 전환할 방법을 미리 준비해 두는 것도 좋은 방법이에요.' },
    ],
  },
  {
    id: '4',
    messages: [
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '안녕하세요! 명절 연휴를 어떻게 활용하고 싶으신가요?' },
      { variant: 'user', senderName: '나', content: '쉬고 싶기도 한데, 연휴 동안 자격증 공부라도 하면 남들보다 앞설 것 같아서 고민이에요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '생산적으로 쓰고 싶은 마음, 충분히 이해해요. 어떤 자격증을 목표로 하고 계세요?' },
      { variant: 'user', senderName: '나', content: 'SQLD나 정보처리기사 쪽을 생각하고 있어요. IT 직군 지원할 때 도움이 될 것 같아서요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '두 자격증 모두 IT 직군 지원 시 실질적으로 도움이 돼요. 다만 하루 2~3시간 정도 적정 분량만 잡는 걸 추천해요.' },
    ],
  },
  {
    id: '5',
    messages: [
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '안녕하세요. 면접 관련해서 도움이 필요하신가요?' },
      { variant: 'user', senderName: '나', content: '네, 면접 볼 때마다 너무 떨려서 준비한 걸 다 못 말하고 나와요. 어떻게 하면 좋을까요?' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '긴장은 누구나 하지만, 그 정도가 지나치면 평소 실력이 안 나오죠. 혹시 긴장이 특히 심해지는 순간이 언제인가요?' },
      { variant: 'user', senderName: '나', content: '첫 질문 받을 때요. 자기소개는 잘 하는데 그 다음 예상 못 한 질문이 나오면 머리가 하얘져요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '"핵심 키워드 3개"로 즉흥 답변 구성하는 연습을 해보세요. 모르면 잠깐 생각할 시간을 요청하는 것도 당당한 태도예요.' },
    ],
  },
  {
    id: '6',
    messages: [
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '안녕하세요. 오늘은 어떤 부분에서 도움이 필요하신가요?' },
      { variant: 'user', senderName: '나', content: '팀 스터디를 운영하고 있는데 멤버들이 너무 제각각이라 진행이 안 되고 있어요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '팀 관리가 쉽지 않죠. 구체적으로 어떤 부분이 가장 문제인가요? 참여율인가요, 아니면 방향성인가요?' },
      { variant: 'user', senderName: '나', content: '참여율이요. 발표 준비를 안 해오는 사람이 매번 같은 사람이에요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '"우리 모두 더 잘 되기 위해"라는 방향으로 1대1로 솔직하게 얘기해보는 게 좋아요. 규칙을 문서화하는 것도 도움이 돼요.' },
    ],
  },
  {
    id: '7',
    messages: [
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '안녕하세요! 삼성전자 지원을 준비하고 계신가요?' },
      { variant: 'user', senderName: '나', content: '네, 삼성전자 DS부문 지원하려는데 어떤 스펙이 중요한지 잘 모르겠어요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: 'DS부문은 반도체 관련 직군이라 전공 지식이 중요해요. 학점, 전공 프로젝트 경험, 관련 인턴이나 연구실 경험이 핵심이에요. 어떤 전공이세요?' },
      { variant: 'user', senderName: '나', content: '전자공학과예요. 학점은 3.7이고 캡스톤 프로젝트 경험은 있어요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '좋은 조건이에요. GSAT 준비와 영어 성적 관리, 직무 관련 논문이나 특허 경험이 있으면 더욱 차별화될 수 있어요.' },
    ],
  },
  {
    id: '8',
    messages: [
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '안녕하세요. 요즘 마음이 어떠세요?' },
      { variant: 'user', senderName: '나', content: '번아웃이 온 것 같아요. 아무것도 하기 싫고 침대에만 있고 싶어요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '그 감정 정말 힘드셨겠어요. 언제부터 그런 느낌이 시작됐는지 기억하세요?' },
      { variant: 'user', senderName: '나', content: '한 두 달 됐어요. 프로젝트 마감이 연속으로 있었는데 그게 끝나고 나서 오히려 더 무기력해졌어요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '큰 긴장 상태가 끝난 뒤 찾아오는 무기력감이에요. 오늘 하루 그냥 쉬는 것도 치유의 일부예요. 작은 것부터 천천히 다시 시작하면 돼요.' },
      { variant: 'user', senderName: '나', content: '그냥 쉬어도 된다는 말이 이상하게 위로가 돼요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '네, 충분히 쉬어도 괜찮아요. 몸과 마음이 회복할 시간이 필요한 거예요.' },
    ],
  },
  {
    id: '9',
    messages: [
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '안녕하세요. 오늘은 어떤 고민을 가져오셨나요?' },
      { variant: 'user', senderName: '나', content: '친한 친구랑 사이가 갑자기 서먹해졌어요. 뭘 잘못한 건지도 모르겠고요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '그런 상황이 정말 답답하죠. 서먹해진 계기가 될 만한 일이 있었나요?' },
      { variant: 'user', senderName: '나', content: '지난번에 그 친구 고민을 들어줄 때 제가 너무 직설적으로 말했던 것 같아요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '"요즘 내가 뭔가 실수한 게 있는 것 같아서"라고 부드럽게 물어보는 것도 좋은 시작이에요.' },
      { variant: 'user', senderName: '나', content: '먼저 연락하는 게 너무 어렵게 느껴져요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '완벽한 말을 준비하려 하지 말고, 진심을 짧게 전달하는 것만으로도 충분해요.' },
    ],
  },
  {
    id: '10',
    messages: [
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '안녕하세요. 요즘 어떻게 지내고 계세요?' },
      { variant: 'user', senderName: '나', content: '잠을 잘 못 자고 있어요. 새벽에 자꾸 깨고 다시 잠들기가 어려워요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '수면 문제는 스트레스나 불안과 연결되는 경우가 많아요. 잠에서 깰 때 어떤 생각이 떠오르나요?' },
      { variant: 'user', senderName: '나', content: '내일 해야 할 일들이 머릿속에서 계속 돌아가요. 마감이 많아서요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '자기 전에 할 일을 종이에 적어두는 "브레인 덤프" 방법이 효과적이에요. 머릿속 생각을 종이에 옮기면 뇌가 쉴 수 있어요.' },
    ],
  },
  {
    id: '11',
    messages: [
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '안녕하세요! 어떤 고민이 있으신가요?' },
      { variant: 'user', senderName: '나', content: '복수전공을 할지 말지 고민이에요. 취업에 실제로 도움이 되는지 모르겠어요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '복수전공의 효과는 목표 직무에 따라 달라요. 어떤 분야로 취업을 희망하시나요?' },
      { variant: 'user', senderName: '나', content: '데이터 분석 쪽이요. 지금 경영학과인데 컴퓨터공학을 복수전공하려고요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '데이터 분석직군에서 경영+CS 조합은 실제로 경쟁력 있어요. 졸업 시기를 먼저 확인하고 결정하세요.' },
      { variant: 'user', senderName: '나', content: '한 학기 더 다녀야 할 수도 있는데 그게 불리하게 작용하지 않을까요?' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '요즘은 졸업 시기보다 스킬셋을 더 중요하게 보는 곳이 많아요. 포트폴리오와 프로젝트 경험이 뒷받침된다면 충분히 설득력 있어요.' },
    ],
  },
  {
    id: '12',
    messages: [
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '안녕하세요. 오늘 이야기 나눠볼 주제가 있으신가요?' },
      { variant: 'user', senderName: '나', content: '발표할 때 목소리가 떨리고 사람들 시선이 너무 신경 쓰여요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '발표 불안은 매우 흔해요. 어떤 상황에서 가장 심한가요?' },
      { variant: 'user', senderName: '나', content: '모르는 사람들 앞에서 더 떨려요. 친한 사람들 앞에선 괜찮은데요.' },
      { variant: 'ai', senderName: '코칭 심리 상담사', avatarSrc: '/images/personas/coaching.png', content: '청중을 "나를 평가하는 사람"이 아니라 "내 이야기를 들으러 온 사람"으로 리프레이밍해보세요. 발표 전 심호흡 4초-유지 4초-내쉬기 4초를 3회 반복하는 것도 효과적이에요.' },
    ],
  },
  {
    id: '13',
    messages: [
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '안녕하세요. 오늘 어떤 감정을 가져오셨나요?' },
      { variant: 'user', senderName: '나', content: '요즘 아무 이유 없이 눈물이 나요. 딱히 슬픈 일도 없는데요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '이유 없는 눈물은 오히려 마음이 보내는 신호일 수 있어요. 최근에 많이 참거나 억눌렀던 감정이 있었나요?' },
      { variant: 'user', senderName: '나', content: '생각해보니 주변에 힘들다고 말을 못 했던 것 같아요. 항상 괜찮은 척했고요.' },
      { variant: 'ai', senderName: '정신건강 상담사', avatarSrc: '/images/personas/mental.png', content: '오늘 이렇게 꺼내놓으신 것만으로도 정말 잘하신 거예요. 누군가에게 "요즘 좀 힘들어"라고 말하는 연습부터 해보는 건 어떨까요?' },
    ],
  },
  {
    id: '14',
    messages: [
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '안녕하세요. 취업 준비 중이신가요?' },
      { variant: 'user', senderName: '나', content: '포트폴리오를 어떻게 구성해야 할지 모르겠어요. 프로젝트가 없는 것도 아닌데 막막해요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '프로젝트가 있다면 충분해요. 어떤 직무를 지원할 예정이에요?' },
      { variant: 'user', senderName: '나', content: '프론트엔드 개발자요. React 프로젝트 3개 정도 있어요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '"무엇을 만들었나"보다 "왜 이 기술을 선택했고 어떤 문제를 해결했나"를 중심으로 작성하세요. 문제 상황 → 해결책 → 결과 구조로 정리하면 설득력이 높아요.' },
      { variant: 'user', senderName: '나', content: '그 구조대로 다시 써봐야겠네요. 막막했던 게 좀 풀리는 것 같아요.' },
      { variant: 'ai', senderName: '진로 및 학업 상담사', avatarSrc: '/images/personas/career.png', content: '충분히 잘 하고 있어요. 프로젝트 하나씩 그 구조로 정리해보시면 생각보다 빠르게 완성될 거예요.' },
    ],
  },
];

const MOCK_SESSION_GROUPS: ChatSessionGroup[] = [
  {
    date: '2026년 2월 17일',
    sessions: [
      { id: '1', title: '설날 기간 친척들과의 불편한 이야기', avatarSrc: '/images/personas/mental.png' },
      { id: '2', title: '잘 나가는 사촌과 비교 당하지 않기', avatarSrc: '/images/personas/coaching.png' },
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
      { id: '5', title: '면접 떨리고 긴장하는 현상 대비', avatarSrc: '/images/personas/career.png' },
    ],
  },
  {
    date: '2026년 2월 14일',
    sessions: [
      { id: '6', title: '팀 스터디 효율적인 진행 방식', avatarSrc: '/images/personas/coaching.png' },
      { id: '7', title: '삼성전자 직군별 갖춰야 할 스펙', avatarSrc: '/images/personas/career.png' },
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
      { id: '12', title: '발표할 때 목소리 떨림 극복하기', avatarSrc: '/images/personas/coaching.png' },
    ],
  },
  {
    date: '2026년 2월 10일',
    sessions: [
      { id: '13', title: '이유 없이 눈물이 나는 요즘', avatarSrc: '/images/personas/mental.png' },
      { id: '14', title: '프론트엔드 포트폴리오 구성 방법', avatarSrc: '/images/personas/career.png' },
    ],
  },
];

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
  const router = useRouter();
  const { activeModal, openModal, closeModal } = useChatModals();
  const remainingCredits = useAuthStore((s) => s.user?.creditBalance ?? 0);
  const useCredit = useAuthStore((s) => s.useCredit);

  const COUNSEL_CREDIT_COST = 70;
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>('1');

  const activeMessages = MOCK_SESSIONS.find((s) => s.id === activeSessionId)?.messages ?? [];

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
    if (remainingCredits < COUNSEL_CREDIT_COST) {
      openModal('credit-shortage');
      return;
    }
    useCredit(COUNSEL_CREDIT_COST);
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
        className="bg-secondary-100/80 absolute top-3 left-3 z-30 flex h-10 w-10 items-center justify-center rounded-lg shadow-md backdrop-blur-sm lg:hidden"
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
        className={`fixed inset-y-0 left-0 z-40 w-[min(320px,85vw)] transform bg-white pt-16 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:z-auto lg:w-80.75 lg:translate-x-0 lg:bg-transparent lg:pt-0 lg:transition-none`}
      >
        <ChatSidebar
          onNewCounsel={handleNewCounsel}
          activeSessionId={activeSessionId}
          onSelectSession={(id) => { setActiveSessionId(id); setSidebarOpen(false); }}
          sessionGroups={MOCK_SESSION_GROUPS}
        />
      </div>

      {/* 메인 채팅 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden pt-14 lg:pt-0">
        <ChatMainArea
          onEndChat={handleEndChat}
          onCreditShortage={() => openModal('credit-shortage')}
          onUnfinishedSession={() => openModal('unfinished-session')}
          initialMessages={activeMessages}
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
        onPurchase={() => { closeModal(); router.push('/shop'); }}
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
