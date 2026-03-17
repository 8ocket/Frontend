export interface CustomizationItems {
  item_id: string; // PK / UUID
  item_type: string; // 아이템_유형 / VARCHAR(30)
  item_name: string; // 아이템명 / VARCHAR(100)
  description: string | null; // 설명 / TEXT
  required_credits: number | null; // 필요_크레딧 / INTEGER
  preview_url: string | null; // 프리뷰_URL / VARCHAR(500)
  is_default: boolean | null; // 기본_제공_여부 / BOOLEAN
  is_active: boolean | null; // 활성화_여부 / BOOLEAN
  created_at: Date | null; // 등록일시 / TIMESTAMP
}
