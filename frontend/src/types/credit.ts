export interface CreditTransactions {
  transaction_id: string; // PK / UUID
  user_id: string; // FK / 사용자_ID / UUID
  transaction_type: string; // 거래_유형 / VARCHAR(30)
  amount: number | null; // 변동량 / INTEGER
  balance_after: number | null; // 거래_후_잔액 / INTEGER
  description: string | null; // 거래_설명 / TEXT
  created_at: Date | null; // 거래_일시 / TIMESTAMP
}
