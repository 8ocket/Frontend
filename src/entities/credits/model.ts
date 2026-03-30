export interface CreditApiResponse<T> {
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

// TODO: 명세서 확정 후 크레딧 잔액 응답 타입 추가
// export interface CreditBalanceResponse { ... }
