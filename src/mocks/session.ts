import { SessionListQuery, SessionListResponse } from '@/entities/session';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockGetSessions = (query: SessionListQuery = {}): SessionListResponse => {
  const page = query.page ?? 1;
  const size = query.size ?? 20;

  const allSessions = [
    {
      session_id: 'session-001',
      persona_image_url: 'https://example.com/persona1.png',
      title: '오늘 직장에서 있었던 일',
      status: 'saved' as const,
      started_at: '2026-03-10T14:30:00Z',
    },
    {
      session_id: 'session-002',
      persona_image_url: 'https://example.com/persona2.png',
      title: '친구와의 갈등',
      status: 'saved' as const,
      started_at: '2026-03-08T10:00:00Z',
    },
    {
      session_id: 'session-003',
      persona_image_url: 'https://example.com/persona1.png',
      title: '',
      status: 'active' as const,
      started_at: '2026-03-13T09:00:00Z',
    },
  ];

  const filtered = query.status
    ? allSessions.filter((s) => s.status === query.status)
    : allSessions;

  return {
    sessions: filtered.slice((page - 1) * size, page * size),
    pagination: {
      page,
      size,
      total_count: filtered.length,
      total_pages: Math.ceil(filtered.length / size),
    },
  };
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
