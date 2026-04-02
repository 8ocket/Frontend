export interface CreditApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 백엔드 응답 타입
export interface CreditProductResponse {
  name: string;
  creditAmount: number;
  price: number;
}

// 유료/무료 잔액
export interface CreditBalanceResponse {
  paidCredit: number;
  freeCredit: number;
}

export interface MyCreditResponse {
  totalCredit: number;
}
