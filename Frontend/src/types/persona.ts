export interface AiPersonas {
  persona_id: string; // PK / UUID
  persona_type: string; // 페르소나_유형 / VARCHAR(50)
  persona_name: string; // 페르소나_이름 / VARCHAR(100)
  description: string | null; // 설명 / TEXT
  tone_settings: string | null; // 톤앤매너_설정 / TEXT
  unlock_credits: number | null; // 해금_필요_크레딧 / INTEGER
  is_default: boolean | null; // 기본_제공_여부 / BOOLEAN
  is_active: boolean | null; // 활성화_여부 / BOOLEAN
  created_at: Date | null; // 생성일시 / TIMESTAMP
}

/** 상점 표시용 페르소나 상품 */
export type PersonaCategory = 'animal' | 'job' | 'limited';

export interface PersonaProduct {
  id: string;
  name: string;
  quote: string;
  description: string;
  image: string;
  unlockCredits: number;
  category: PersonaCategory;
  isUnlocked?: boolean;
  isLimited?: boolean;
  limitedStock?: number;
}
