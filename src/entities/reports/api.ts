import { api } from '@/shared/api/axios';
import {
  CreateReportRequest,
  CreateReportResponse,
  GetReportListResponse,
  ReportDetailResponse,
  ReportApiResponse,
  ReportType,
} from './model';
import { mockCreateReport, mockGetReportDetail, mockGetReportList } from '@/mocks';
import { USE_MOCK } from '@/shared/lib/env';

/**
 * 리포트 생성 요청 API
 * POST /v1/reports
 */
export const createReportApi = async (req: CreateReportRequest): Promise<CreateReportResponse> => {
  if (USE_MOCK) return mockCreateReport(req);

  const response = await api.post<ReportApiResponse<CreateReportResponse>>('/reports', req);

  if (response.data.code === 'ok' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || '리포트 생성 요청 실패');
};

/**
 * 리포트 목록 조회
 * GET /v1/reports?report_type=weekly|monthly
 */
export const getReportListApi = async (reportType?: ReportType): Promise<GetReportListResponse> => {
  // mock 모드에서도 리포트 페이지가 초기 로딩/목록 조회 단계부터 끊기지 않도록 동일한 진입점을 제공합니다.
  if (USE_MOCK) return mockGetReportList(reportType);

  const params = reportType ? { report_type: reportType } : {};
  const response = await api.get<ReportApiResponse<GetReportListResponse>>('/reports', { params });

  if (response.data.code === 'ok' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || '리포트 목록 조회 실패');
};

/**
 * 리포트 상세 조회 (상태 폴링에도 활용)
 * GET /v1/reports/{report_id}
 */
export const getReportDetailApi = async (reportId: string): Promise<ReportDetailResponse> => {
  // 생성 후 폴링되는 상세 조회도 mock 응답을 지원해야 generating -> completed 흐름을 재현할 수 있습니다.
  if (USE_MOCK) return mockGetReportDetail(reportId);

  const response = await api.get<ReportApiResponse<ReportDetailResponse>>(`/reports/${reportId}`);

  if (response.data.code === 'ok' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || '리포트 상세 조회 실패');
};
