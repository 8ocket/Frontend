import { api } from '@/shared/api/axios';
import { CreditApiResponse, CreditProductResponse, MyCreditResponse } from './model';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * 크레딧 상품 목록 조회 API
 * @returns 크레딧 상품 배열
 * @throws API 호출 실패 시 에러 발생
 */
export const getCreditProductsApi = async (): Promise<CreditProductResponse[]> => {
  if (USE_MOCK) {
    return [
      { name: '소량 크레딧', creditAmount: 100, price: 1000 },
      { name: '중간 크레딧', creditAmount: 500, price: 4500 },
      { name: '대량 크레딧', creditAmount: 1000, price: 8000 },
    ];
  }

  const response = await api.get<CreditApiResponse<CreditProductResponse[]>>('/credit');
  return response.data.data;
};

/**
 * 내 크레딧 조회 API
 * @returns 내 크레딧 정보
 * @throws API 호출 실패 시 에러 발생
 */
export const getMyCreditApi = async (): Promise<MyCreditResponse> => {
  if (USE_MOCK) {
    return { totalCredit: 150 }; // 예시로 150 크레딧 반환
  }

  const response = await api.get<CreditApiResponse<MyCreditResponse>>('/credits/me');
  return response.data.data;
};
