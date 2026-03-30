import { api } from '@/shared/api/axios';
import {
  CreateReportRequest,
  CreateReportResponse,
  GetReportListResponse,
  ReportDetailResponse,
  ReportApiResponse,
  ReportType,
} from './model';
import { mockCreateReport } from '@/mocks';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

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
  const response = await api.get<ReportApiResponse<ReportDetailResponse>>(`/reports/${reportId}`);

  if (response.data.code === 'ok' && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || '리포트 상세 조회 실패');
};
