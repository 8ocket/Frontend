export interface EmotionExtractions {
  extraction_id: string; // PK / UUID
  session_id: string; // FK / 세션_ID / UUID
  emotion_type: string; // 감정_종류 / VARCHAR(50)
  intensity: number | null; // 감정_강도 / INTEGER
  score: number | null; // 감정_점수 / INTEGER
  is_primary: boolean | null; // 대표_감정_여부 / BOOLEAN
  created_at: Date | null; // 추출_시간 / TIMESTAMP
}

export interface EmotionKeywords {
  keyword_id: string; // PK / UUID
  session_id: string; // FK / 세션_ID / UUID
  keyword: string; // 추출된_키워드 / VARCHAR(100)
  keyword_type: string; // 키워드_유형 / VARCHAR(20)
  frequency: number | null; // 등장_빈도(없어 도 될지도? 별도 계산 계산) / INTEGER
  created_at: Date | null; // 추출_시간 / TIMESTAMP
}

export interface EmotionCards {
  card_id: string; // PK / UUID
  session_id: string; // FK / 세션_ID / UUID
  user_id: string; // FK / 사용자_ID / UUID
  primary_color: string; // 주요_색상 / VARCHAR(7)
  saturation: number | null; // 채도 / INTEGER
  gradient_colors: string | null; // 그라데이션_색상 / TEXT
  image_url: string | null; // 카드_이미지_URL / VARCHAR(500)
  interpretation: string | null; // 해설_텍스트 / TEXT
  generation_metadata: string | null; // 생성_메타데이터 / TEXT
  created_at: Date | null; // 생성일시 / TIMESTAMP
}
