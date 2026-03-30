import { api } from '@/shared/api/axios';
import { ApiResponse } from '@/entities/user/model';
import { CreateReportRequest, CreateReportResponse } from './model';
import { mockCreateReport } from '@/mocks';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * 리포트 생성 요청 API
 * POST /v1/reports
 */
export const createReportApi = async (req: CreateReportRequest): Promise<CreateReportResponse> => {
  if (USE_MOCK) return mockCreateReport(req);

  const response = await api.post<ApiResponse<CreateReportResponse>>('/reports', req);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '리포트 생성 요청 실패');
};
