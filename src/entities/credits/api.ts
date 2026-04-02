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
      { name: '소형', creditAmount: 200, price: 2200 },
      { name: '중형', creditAmount: 500, price: 4900 },
      { name: '대형', creditAmount: 1200, price: 10900 },
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
