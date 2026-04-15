import { ApiResponse } from '@/entities/user/model';
import { api } from '@/shared/api/axios';
import type { SummaryListResponse, SummaryResponse, SummaryUpdateRequest } from './model';

/**
 * 마음 기록 카드 조회
 * GET /v1/summaries/{summary_id}
 */
export const getSummaryApi = async (summaryId: string): Promise<SummaryResponse> => {
  const response = await api.get<ApiResponse<SummaryResponse>>(`/summaries/${summaryId}`);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '마음 기록 조회 실패');
};

/**
 * 마음 기록 카드 텍스트 수정
 * PUT /v1/summaries/{summary_id}
 */
export const updateSummaryApi = async (
  summaryId: string,
  body: SummaryUpdateRequest
): Promise<SummaryResponse> => {
  const response = await api.put<ApiResponse<SummaryResponse>>(`/summaries/${summaryId}`, body);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '마음 기록 수정 실패');
};

/**
 * 마음 기록 카드 앞면 이미지 업로드
 * PATCH /v1/summaries/{summary_id}/image
 */
export const uploadSummaryCardImageApi = async (summaryId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('summary_card', file);
  await api.patch(`/summaries/${summaryId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 마음 기록 목록 조회
 * GET /v1/summaries?page=0&size=20
 */
export const getSummaryListApi = async (page = 0, size = 20): Promise<SummaryListResponse> => {
  const response = await api.get<ApiResponse<SummaryListResponse>>(
    `/summaries?page=${page}&size=${size}`
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || '마음 기록 목록 조회 실패');
};
