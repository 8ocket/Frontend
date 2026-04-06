import { api } from '@/shared/api/axios';
import {
  CreateReportRequest,
  ReportStatusEvent,
  ReportCompleteEvent,
  GetReportListResponse,
  ReportDetailResponse,
  ReportApiResponse,
  ReportType,
  SuggestionItem,
} from './model';
import { mockCreateReport, mockGetReportDetail, mockGetReportList, mockGetReportSuggestions } from '@/mocks';
import { USE_MOCK } from '@/shared/lib/env';
import { getCookie } from '@/shared/lib/utils/cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

/**
 * 리포트 생성 요청 API (SSE 스트리밍)
 * POST /v1/reports
 */
export const createReportApi = async (
  req: CreateReportRequest,
  onStatus: (event: ReportStatusEvent) => void,
  onComplete: (event: ReportCompleteEvent) => void,
  onError?: (message: string) => void
): Promise<void> => {
  if (USE_MOCK) return mockCreateReport(req, onStatus, onComplete);

  const token = getCookie('accessToken');
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...req,
      report_type: req.report_type.toUpperCase(),
    }),
  });

  if (!response.ok) {
    let code = '';
    try {
      const body = await response.json();
      code = body.code || '';
    } catch {}
    throw new Error(code || String(response.status));
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

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
            if (currentEvent === 'status') onStatus(data);
            if (currentEvent === 'ai_complete') onComplete(data);
            if (currentEvent === 'error') onError?.(data.message);
          } catch {}
        }
      }
      if (currentEvent === 'done') {
        reader.cancel();
        return;
      }
    }
  }
};

/**
 * 리포트 목록 조회
 * GET /v1/reports?report_type=weekly|monthly
 */
export const getReportListApi = async (reportType?: ReportType): Promise<GetReportListResponse> => {
  if (USE_MOCK) return mockGetReportList(reportType);

  const params = reportType ? { report_type: reportType } : {};
  const response = await api.get<ReportApiResponse<GetReportListResponse>>('/reports', { params });

  if (response.data.code === 'ok' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || '리포트 목록 조회 실패');
};

/**
 * 리포트 상세 조회
 * GET /v1/reports/{report_id}
 */
export const getReportDetailApi = async (reportId: string): Promise<ReportDetailResponse> => {
  if (USE_MOCK) return mockGetReportDetail(reportId);

  const response = await api.get<ReportApiResponse<ReportDetailResponse>>(`/reports/${reportId}`);

  if (response.data.code === 'ok' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || '리포트 상세 조회 실패');
};

/**
 * 맞춤형 행동 제언 조회
 * GET /v1/reports/{report_id}/suggestions
 */
export const getReportSuggestionsApi = async (reportId: string): Promise<SuggestionItem[]> => {
  if (USE_MOCK) return mockGetReportSuggestions(reportId);

  const response = await api.get<ReportApiResponse<SuggestionItem[]>>(
    `/reports/${reportId}/suggestions`,
  );

  if (response.data.code === 'ok' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || '행동 제언 조회 실패');
};
