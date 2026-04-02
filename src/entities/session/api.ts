import { api } from '@/shared/api/axios';
import { ApiResponse } from '@/entities/user/model';
import { SessionListQuery, SessionListResponse, CreateSessionRequest, CreateSessionResponse, ActiveSessionResponse, SessionDetailResponse, FinalizeCompleteEvent } from '@/entities/session/model';
import { mockGetSessions, mockCreateSession, mockGetActiveSession, mockGetSessionDetail, mockFinalizeSession } from '@/mocks';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
/**
 * 세션 목록 조회 API
 * GET /v1/sessions
 */
export const getSessionsApi = async (
  query: SessionListQuery = {}
): Promise<SessionListResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGetSessions(query)), 500);
    });
  }

  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.size) params.set('size', String(query.size));
  if (query.start_date) params.set('start_date', query.start_date);
  if (query.end_date) params.set('end_date', query.end_date);
  if (query.persona_ids?.length) params.set('persona_ids', query.persona_ids.join(','));

  const response = await api.get<ApiResponse<SessionListResponse>>(
    `/sessions?${params.toString()}`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '세션 목록 조회 실패');
};

/**
 * 미완료 세션 확인 API
 * GET /v1/sessions/active
 */
export const getActiveSessionApi = async (): Promise<ActiveSessionResponse | null> => {
  if (USE_MOCK) return mockGetActiveSession();

  const response = await api.get<ApiResponse<ActiveSessionResponse | null>>('/sessions/active');

  if (response.data.success) {
    return response.data.data ?? null;
  }

  throw new Error(response.data.error?.message || '미완료 세션 조회 실패');
};

/**
 * 세션 생성 API
 * POST /v1/sessions
 */
export const createSessionApi = async (req: CreateSessionRequest): Promise<CreateSessionResponse> => {
  if (USE_MOCK) return mockCreateSession(req);

  const response = await api.post<ApiResponse<CreateSessionResponse>>('/sessions', req);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '세션 생성에 실패했습니다.');
};

/**
 * 세션 상세 조회 API (대화 내역 포함)
 * GET /v1/sessions/{session_id}
 */
export const getSessionDetailApi = async (sessionId: string): Promise<SessionDetailResponse> => {
  if (USE_MOCK) return mockGetSessionDetail(sessionId);

  const response = await api.get<ApiResponse<SessionDetailResponse>>(`/sessions/${sessionId}`);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '세션 상세 조회 실패');
};

/**
 * 세션 종료 + 마음 기록 생성 (SSE)
 * POST /v1/sessions/{session_id}/finalize
 */
export const finalizeSessionStream = async (
  sessionId: string,
  token: string,
  onStatus: (step: string, message: string) => void,
  onComplete: (data: FinalizeCompleteEvent) => void,
  onDone: () => void
): Promise<void> => {
  if (USE_MOCK) return mockFinalizeSession(onStatus, onComplete, onDone);

  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/finalize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const reader = response.body?.getReader();
  if (!reader) return;

  let currentEvent = '';
  const decoder = new TextDecoder();
  // finalize SSE도 chunk 단위로 끊어질 수 있어, 이벤트 종료 구분자(\n\n) 기준으로 누적 파싱합니다.
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      buffer += decoder.decode();
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const eventBlock of events) {
      const lines = eventBlock.split('\n');

      for (const line of lines) {
        if (line.startsWith('event:')) {
          currentEvent = line.replace('event:', '').trim();
        }
        if (line.startsWith('data:')) {
          const raw = line.replace('data:', '').trim();
          if (!raw) continue;
          try {
            const data = JSON.parse(raw);
            if (currentEvent === 'status') onStatus(data.step, data.message);
            if (currentEvent === 'ai_complete') onComplete(data);
            if (currentEvent === 'done') {
              onDone();
              reader.cancel();
              return;
            }
          } catch {
            // malformed JSON 무시
          }
        }
      }
    }
  }
};
