import { z } from 'zod';

// 크레딧 상품
export const CreditProductResponseSchema = z.object({
  name: z.string(),
  creditAmount: z.number(),
  price: z.number(),
});

// 내 크레딧
export const MyCreditResponseSchema = z.object({
  totalCredit: z.number(),
});

// 결제 준비
export const CreatePaymentResponseSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  orderName: z.string(),
});

// 결제 내역 아이템
export const PaymentHistoryItemSchema = z.object({
  paymentId: z.string(),
  amount: z.number(),
  orderName: z.string(),
  status: z.string(),
  approvedAt: z.string(),
});

// 결제 내역 페이지
export const PaymentHistoryResponseSchema = z.object({
  content: z.array(PaymentHistoryItemSchema),
  empty: z.boolean(),
  first: z.boolean(),
  last: z.boolean(),
  number: z.number(),
  numberOfElements: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});
