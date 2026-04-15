import {
  ActiveSessionResponse,
  CreateSessionAiCompleteEvent,
  CreateSessionRequest,
  FinalizeCompleteEvent,
  SessionDetailResponse,
  SessionListQuery,
  SessionListResponse,
  SessionProgressResponse,
} from '@/entities/session/model';
import { ApiResponse } from '@/entities/user/model';
import {
  mockCreateSessionStream,
  mockDeleteSession,
  mockFinalizeSession,
  mockGetActiveSession,
  mockGetSessionDetail,
  mockGetSessionProgress,
  mockGetSessions,
} from '@/mocks';
import { api } from '@/shared/api/axios';
import { USE_MOCK } from '@/shared/lib/env';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

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

  const response = await api.get<ApiResponse<SessionListResponse>>(
    `/sessions?${params.toString()}`
  );

  const { sessions, pagination } = response.data as unknown as SessionListResponse;
  return { sessions, pagination };
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
 * 세션 생성 + 첫 AI 응답 스트리밍 (SSE)
 * POST /v1/sessions
 * 이벤트 순서: [ai_chunk × N] → ai_complete → session_title → done
 */
export const createSessionStream = async (
  req: CreateSessionRequest,
  token: string,
  onChunk: (chunk: string) => void,
  onComplete: (data: CreateSessionAiCompleteEvent) => void,
  onSessionTitle: (title: string) => void,
  onDone: () => void,
  onError?: (message: string) => void
): Promise<void> => {
  if (USE_MOCK) return mockCreateSessionStream(onChunk, onComplete, onSessionTitle, onDone);

  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    let code = '';
    try {
      const body = await response.json();
      const msg: string = body.message || '';
      if (msg.includes('크레딧')) code = 'INSUFFICIENT_CREDIT';
      else code = body.code || body.error?.code || '';
    } catch {}
    throw new Error(code || String(response.status));
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';
  let doneHandled = false;

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
            if (currentEvent === 'ai_chunk') onChunk(data.content);
            if (currentEvent === 'ai_complete') onComplete(data);
            if (currentEvent === 'session_title') onSessionTitle(data.title);
            if (currentEvent === 'error') onError?.(data.message);
            if (currentEvent === 'done') {
              doneHandled = true;
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

  // done 이벤트 없이 스트림이 종료된 경우 fallback
  if (!doneHandled) onDone();
};

/**
 * 세션 상세 조회 API (대화 내역 포함)
 * GET /v1/sessions/{session_id}
 */
export const getSessionDetailApi = async (sessionId: string): Promise<SessionDetailResponse> => {
  if (USE_MOCK) return mockGetSessionDetail(sessionId);

  const response = await api.get<ApiResponse<SessionDetailResponse>>(`/sessions/${sessionId}`);
  const { card_image_url, persona_image_url, persona_name, status, messages, has_summary, session_id } = response.data as unknown as SessionDetailResponse;
  return { session_id, card_image_url, persona_image_url, persona_name, status, messages, has_summary };
};

/**
 * 세션 삭제 API
 * DELETE /v1/sessions/{session_id}
 */
export const deleteSessionApi = async (sessionId: string): Promise<void> => {
  if (USE_MOCK) return mockDeleteSession(sessionId);
  await api.delete(`/sessions/${sessionId}`);
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
  onDone: () => void,
  signal?: AbortSignal,
  onError?: (message: string) => void
): Promise<void> => {
  if (USE_MOCK) return mockFinalizeSession(onStatus, onComplete, onDone);

  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/finalize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  if (!response.ok) {
    let code = '';
    try {
      const body = await response.json();
      code = body.code || body.error?.code || '';
    } catch {}
    throw new Error(code || String(response.status));
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  let currentEvent = '';
  const decoder = new TextDecoder();
  // finalize SSE도 chunk 단위로 끊어질 수 있어, 이벤트 종료 구분자(\n\n) 기준으로 누적 파싱합니다.
  let buffer = '';
  let doneHandled = false;

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
      currentEvent = '';

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
            if (currentEvent === 'server_error' || currentEvent === 'error') onError?.(data.content ?? data.message);
          } catch {
            // malformed JSON 무시
          }
        }
      }

      // done 이벤트는 data 유무/유효성과 무관하게 처리
      if (currentEvent === 'done') {
        doneHandled = true;
        onDone();
        reader.cancel();
        return;
      }
    }
  }

  // done 이벤트 없이 스트림이 종료된 경우 fallback
  if (!doneHandled) onDone();
};

/**
 * 리포트 달성률 조회 API
 * GET /v1/sessions/me/progress
 */
export const getSessionProgressApi = async (): Promise<SessionProgressResponse[]> => {
  if (USE_MOCK) return mockGetSessionProgress();

  const response =
    await api.get<ApiResponse<SessionProgressResponse[]>>('/sessions/me/progress');

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '리포트 달성률 조회 실패');
};
