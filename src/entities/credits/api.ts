import { api } from '@/shared/api/axios';
import { CreditApiResponse, CreditProductResponse } from './model';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

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
