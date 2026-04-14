// ─── Plutchik 감정 모델 기반 8가지 기본 감정 ───

/** 플루치크 감정 휠 기반 8가지 기본 감정 타입 */
export type EmotionType =
  | 'joy'
  | 'trust'
  | 'fear'
  | 'surprise'
  | 'sadness'
  | 'disgust'
  | 'anger'
  | 'anticipation';

/** 감정 강도 레벨 (플루치크 감정 휠의 3단계) */
export type EmotionIntensity = 'mild' | 'basic' | 'intense';

/** 카드 내 브러시 역할 (Figma 원칙) */
export type BrushRole = 'primary' | 'secondary' | 'background';

/**
 * 감정별 메타데이터 (상수 매핑에 사용)
 * Figma 디자인 시스템 기반
 */
export interface EmotionMeta {
  /** 감정 타입 키 */
  type: EmotionType;
  /** 한글 감정명 */
  label: string;
  /** 영문 감정명 (기본 강도) */
  englishLabel: string;
  /** 강도별 영문 감정명 */
  intensityLabels: Record<EmotionIntensity, string>;
  /** CSS 변수명 (color-emotion-* 에 대응) */
  cssVar: string;
  /** hex 색상값 (Figma CARD BRUSH 브러시 실제 색상) */
  hex: string;
}

/**
 * 카드에 적용되는 감정 레이어 (최대 3개)
 * Figma 규칙: 주감정 60% / 부감정 30% / 보조감정 10%
 */
export interface EmotionLayer {
  /** 감정 타입 */
  type: EmotionType;
  /** 브러시 역할 */
  role: BrushRole;
  /** opacity (0~1) — primary: 0.6, secondary: 0.3, background: 0.1 */
  opacity: number;
  /** blur 수치 (px) — primary: 10, secondary: 20, background: 30 */
  blur: number;
  /** 감정 점수/비중 (%) */
  score?: number;
}

/**
 * 감정 카드 렌더링에 필요한 데이터
 * API 응답을 가공하여 컴포넌트에 전달
 */
export interface EmotionCardData {
  /** 카드 ID */
  cardId: string;
  /** 요약 ID */
  summaryId: string;
  /** 세션 ID */
  sessionId: string;
  /** 사용자 이름 */
  userName?: string;
  /** 감정 레이어 (최대 3개, 주감정/부감정/보조감정) */
  layers: EmotionLayer[];
  /** 마음 키워드 (ex: "#신뢰[63%]") */
  keywords: EmotionKeywordTag[];
  /** 상담 요약 */
  summary: {
    title: string;
    description: string;
  };
  /** 사건 요약 */
  fact: string | null;
  /** 감정 요약 */
  emotion: string | null;
  /** AI 인사이트 */
  insight: string | null;
  /** 생성일시 */
  createdAt: Date | null;
}

/** 키워드 태그 (카드 뒷면에 표시) */
export interface EmotionKeywordTag {
  /** 키워드 텍스트 */
  keyword: string;
  /** 감정 타입 (색상 매핑용) */
  emotionType?: EmotionType;
  /** 비중 (%) */
  percentage?: number;
}

// ─── DB 엔티티 인터페이스 (기존) ───

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
