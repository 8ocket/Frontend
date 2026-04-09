import { api } from '@/shared/api/axios';
import { CreditApiResponse, CreditProductResponse, MyCreditResponse, PaymentHistoryResponse } from './model';
import { USE_MOCK } from '@/shared/lib/env';
import { safeParse } from '@/shared/lib/utils/parse';
import {
  CreditProductResponseSchema,
  MyCreditResponseSchema,
  CreatePaymentResponseSchema,
  PaymentHistoryResponseSchema,
} from './schema';
import { z } from 'zod';

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

  const response = await api.get<CreditApiResponse<CreditProductResponse[]>>('/credits');
  return safeParse(z.array(CreditProductResponseSchema), response.data.data);
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
  return safeParse(MyCreditResponseSchema, response.data.data);
};

/**
 * 크레딧 상품 구매를 위한 결제 준비 APIa
 * @param productType
 * @returns 결제 준비를 위한 주문 정보 (orderId, amount, orderName)
 * @throws API 호출 실패 시 에러 발생
 */
export const createPaymentApi = async (productType: 'SMALL' | 'MEDIUM' | 'LARGE') => {
  const response = await api.post<
    CreditApiResponse<{ orderId: string; amount: number; orderName: string }>
  >('/payments', { productType });
  return safeParse(CreatePaymentResponseSchema, response.data.data);
};

/**
 * 결제 완료 API
 * @param paymentKey 결제 키
 * @param orderId 주문 ID
 * @param amount 결제 금액
 * @throws API 호출 실패 시 에러 발생
 */
export const confirmPaymentApi = async (paymentKey: string, orderId: string, amount: number) => {
  await api.post('/payments/confirm', { paymentKey, orderId, amount });
};

/**
 * 유료 크레딧 결제 내역 조회 API
 * @returns 결제 내역 페이지
 * @throws API 호출 실패 시 에러 발생
 */
export const getPaymentHistoryApi = async (): Promise<PaymentHistoryResponse> => {
  const response = await api.get<CreditApiResponse<PaymentHistoryResponse>>('/payments/history');
  return safeParse(PaymentHistoryResponseSchema, response.data.data);
};

/**
 * 결제 취소(크레딧 환불) API
 * @param paymentId 취소할 결제 ID
 * @returns 취소된 결제 ID
 * @throws API 호출 실패 시 에러 발생
 */
export const cancelPaymentApi = async (paymentId: string): Promise<string> => {
  const response = await api.post<CreditApiResponse<string>>(`/payments/${paymentId}/cancel`);
  return response.data.data;
};
