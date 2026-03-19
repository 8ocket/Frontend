import { api } from '@/shared/api/axios';
import { ApiResponse } from '@/entities/user/model';
import { SessionListQuery, SessionListResponse } from '@/entities/session/model';
import { mockGetSessions } from '@/mocks';

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
  if (query.status) params.set('status', query.status);
  if (query.page) params.set('page', String(query.page));
  if (query.size) params.set('size', String(query.size));

  const response = await api.get<ApiResponse<SessionListResponse>>(
    `/sessions?${params.toString()}`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '세션 목록 조회 실패');
};
