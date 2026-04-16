import { ApiResponse } from '@/entities/user/model';
import { api } from '@/shared/api/axios';
import type { SummaryListResponse, SummaryResponse, SummaryUpdateRequest } from './model';

/**
 * 마음 기록 카드 조회
 * GET /v1/summaries/{summary_id}
 */
export const getSummaryApi = async (summaryId: string): Promise<SummaryResponse> => {
  const response = await api.get<ApiResponse<SummaryResponse>>(`/summaries/${summaryId}`);

  // 백엔드 ApiResult는 { code, message, data } 구조 — success 필드 없음
  if (response.data.data) {
    return response.data.data;
  }

  throw new Error('마음 기록 조회 실패');
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

  // 백엔드 ApiResult는 { code, message, data } 구조 — success 필드 없음
  if (response.data.data) {
    return response.data.data;
  }

  throw new Error('마음 기록 수정 실패');
};

/**
 * 마음 기록 카드 앞/뒷면 이미지 업로드
 * PATCH /v1/summaries/{summary_id}/image
 *
 * 백엔드 @RequestPart 필드명:
 *   - card_front_image: 텍스트+오로라 후면 (EmotionCardBack)
 *   - card_back_image:  오로라 전면 (EmotionCardFront)
 *
 * 변경 이력: 기존 단일 필드 "summary_card" → 앞/뒷면 분리 업로드로 백엔드 수정됨
 */
export const uploadSummaryCardImageApi = async (
  summaryId: string,
  frontFile: File, // card_front_image — 텍스트+오로라 후면 (EmotionCardBack)
  backFile: File,  // card_back_image  — 오로라 전면 (EmotionCardFront)
): Promise<void> => {
  const formData = new FormData();
  formData.append('card_front_image', frontFile);
  formData.append('card_back_image', backFile);
  await api.patch(`/summaries/${summaryId}/image`, formData);
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
