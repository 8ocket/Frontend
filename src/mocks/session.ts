import { SessionListQuery, SessionListResponse, SessionListItem, CreateSessionRequest, CreateSessionAiCompleteEvent, ActiveSessionResponse } from '@/entities/session';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockGetSessions = (query: SessionListQuery = {}): SessionListResponse => {
  const page = query.page ?? 1;
  const size = query.size ?? 20;

  const allSessions: SessionListItem[] = [
    {
      sessionId: 'session-001',
      title: '오늘 직장에서 있었던 일',
      status: 'SAVED',
      startedAt: '2026-03-10T14:30:00Z',
    },
    {
      sessionId: 'session-002',
      title: '친구와의 갈등',
      status: 'SAVED',
      startedAt: '2026-03-08T10:00:00Z',
    },
    {
      sessionId: 'session-003',
      title: '번아웃 극복하기',
      status: 'ACTIVE',
      startedAt: '2026-03-13T09:00:00Z',
    },
  ];

  return {
    sessions: allSessions.slice((page - 1) * size, page * size),
    pagination: {
      page,
      size,
      total_count: allSessions.length,
      total_pages: Math.ceil(allSessions.length / size),
    },
  };
};

export const mockGetActiveSession = async (): Promise<ActiveSessionResponse | null> => {
  await delay(500);
  // 미완료 세션 있는 경우 테스트용
  return {
    session_id: 'mock-active-session-001',
    title: '설날 기간 친척들과의 불편한 이야기',
    started_at: '2026-02-17T14:30:00Z',
  };
  // 없는 경우: return null;
};

export const mockCreateSessionStream = async (
  onChunk: (chunk: string) => void,
  onComplete: (data: CreateSessionAiCompleteEvent) => void,
  onSessionTitle: (title: string) => void,
  onDone: () => void,
  _req?: CreateSessionRequest
): Promise<void> => {
  const chunks = ['안녕', '하세요,', ' 오늘은 어떤', ' 이야기를 나눠볼까요?'];
  for (const chunk of chunks) {
    await delay(300);
    onChunk(chunk);
  }
  const sessionId = `mock-session-${Date.now()}`;
  onComplete({ session_id: sessionId, status: 'ACTIVE', started_at: new Date().toISOString() });
  await delay(200);
  onSessionTitle('새로운 상담');
  onDone();
};

export const mockFinalizeSession = async (
  onStatus: (step: string, message: string) => void,
  onComplete: (data: import('@/entities/session/model').FinalizeCompleteEvent) => void,
  onDone: () => void
): Promise<void> => {
  await delay(800);
  onStatus('analyzing', '상담 기록을 분석 중입니다 ...');
  await delay(800);
  onStatus('summarizing', '상담 기록을 요약 중입니다 ...');
  await delay(800);
  onStatus('creating_card', '마음기록 카드를 생성 중입니다 ...');
  await delay(1000);
  onComplete({
    summary_id: 'mock-summary-id',
    emotions: [
      { intensity: 4, source_keyword: '오늘 너무 힘들었어', emotion_type: 'sadness' },
      { intensity: 3, source_keyword: '화가 났어', emotion_type: 'anger' },
    ],
    card_image_url: '/images/personas/mental.png',
    summary: {
      fact: '팀 미팅에서 의견이 무시당하는 경험을 했음',
      emotion: '소외감과 답답함을 느끼고 있음',
      insight: '자신의 의견을 표현하는 방식에 대해 돌아볼 필요가 있음',
    },
  });
  onDone();
};

export const mockGetSessionDetail = async (sessionId: string): Promise<import('@/entities/session/model').SessionDetailResponse> => {
  await delay(500);
  return {
    session_id: sessionId,
    persona_image_url: '/images/personas/mental.png',
    persona_name: '마음이',
    status: 'SAVED',
    // 최신 → 과거 순 (API 스펙)
    messages: [
      { message_id: 'msg-002', role: 'user', content: '오늘 팀 미팅에서 제 의견이 무시당한 것 같아서...', sequence_num: 2, created_at: '2026-02-21T14:31:00Z' },
      { message_id: 'msg-001', role: 'assistant', content: '안녕하세요, 오늘은 어떤 이야기를 나눠볼까요?', sequence_num: 1, created_at: '2026-02-21T14:30:01Z' },
    ],
    has_summary: false,
  };
};

export const mockDeleteSession = async (_sessionId: string): Promise<void> => {
  await delay(300);
};

export const mockSendMessageStream = async (
  onChunk: (chunk: string) => void,
  onCrisis: (_msg: string) => void,
  onDone: () => void
) => {
  const chunks = ['안녕', '하세요,', '오늘은 어떤', '이야기를 나눠볼까요?'];
  for (const chunk of chunks) {
    await delay(300);
    onChunk(chunk);
  }
  onDone();
};
