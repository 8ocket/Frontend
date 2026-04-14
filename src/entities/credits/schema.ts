import { z } from 'zod';

// 크레딧 상품
export const CreditProductResponseSchema = z.object({
  name: z.string(),
  creditAmount: z.number(),
  price: z.number(),
});

// 크레딧 거래 내역 아이템
export const CreditTransactionSchema = z.object({
  transactionType: z.string(),
  amount: z.number(),
  createdAt: z.string(),
});

// 내 크레딧
export const MyCreditResponseSchema = z.object({
  totalCredit: z.number(),
  transactions: z.array(CreditTransactionSchema),
});

// 결제 준비
export const CreatePaymentResponseSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  orderName: z.string(),
});

// 결제 내역 아이템
export const PaymentHistoryItemSchema = z.object({
  paymentId: z.string().optional(),
  amount: z.number(),
  orderName: z.string(),
  status: z.string(),
  approvedAt: z.string().nullable(),
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
