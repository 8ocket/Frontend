import { USE_MOCK } from '@/shared/lib/env';
import { MOCK_COLLECTION_CARDS } from '@/mocks/emotion';
import type { EmotionCardData } from './model';

/**
 * 감정카드(컬렉션) 목록 조회
 * 백엔드 연동 시 실제 엔드포인트로 교체
 */
export const getCollectionCardsApi = async (): Promise<EmotionCardData[]> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_COLLECTION_CARDS), 300);
    });
  }

  // TODO: 실제 API 연동 시 교체
  // const response = await api.get<ApiResponse<EmotionCardData[]>>('/cards');
  // if (response.data.success && response.data.data) return response.data.data;
  // throw new Error('감정카드 목록 조회 실패');

  return MOCK_COLLECTION_CARDS;
};
