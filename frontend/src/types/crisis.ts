export interface CrisisLogs {
  log_id: string; // PK / UUID
  session_id: string; // FK / 세션_ID / UUID
  user_id: string; // FK / 사용자_ID / UUID
  message_id: string; // FK / 감지_메시지_ID / UUID
  detected_keywords: string | null; // 감지_키워드 / TEXT
  response_message: string | null; // 안내_메시지 / TEXT
  user_acknowledged: boolean | null; // 사용자_확인_여부 / BOOLEAN
  detected_at: Date | null; // 감지_시점 / TIMESTAMP
}
