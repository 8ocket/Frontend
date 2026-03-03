export interface Notifications {
  notification_id: string; // PK / UUID
  user_id: string; // FK / 사용자_ID / UUID
  notification_type: string; // 알림_유형 / VARCHAR(30)
  title: string; // 알림_제목 / VARCHAR(100)
  content: string | null; // 알림_내용 / TEXT
  related_resource_id: string | null; // 관련_리소스_ID / UUID
  related_resource_type: string | null; // 리소스_유형 / VARCHAR(30)
  is_read: boolean | null; // 읽음_여부 / BOOLEAN
  is_pushed: boolean | null; // 푸시_발송_여부 / BOOLEAN
  created_at: Date | null; // 생성일시 / TIMESTAMP
}
