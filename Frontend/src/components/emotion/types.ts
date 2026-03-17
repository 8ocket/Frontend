import type { EmotionCardData, EmotionLayer, EmotionType } from '@/types/emotion';

// ─── EmotionCard 컴포넌트 Props ───

/** 카드 사이즈 프리셋 */
export type CardSizePreset = 'default' | 'sample' | 'back';

/** 카드 면 */
export type CardFace = 'front' | 'back';

/** EmotionCard 루트 컴포넌트 Props */
export interface EmotionCardProps {
  /** 카드 렌더링 데이터 */
  data: EmotionCardData;
  /** 초기 표시할 면 (default: 'front') */
  initialFace?: CardFace;
  /** 카드 크기 프리셋 (default: 'default') */
  size?: CardSizePreset;
  /** 커스텀 width (px) — size보다 우선 */
  width?: number;
  /** 카드 클릭(플립) 핸들러 */
  onFlip?: (face: CardFace) => void;
  /** 감정명 라벨 직접 지정 (미지정 시 getEmotionDisplayName 사용) */
  labelOverride?: string;
  /** 추가 클래스 */
  className?: string;
}

/** EmotionCardFront (앞면) Props */
export interface EmotionCardFrontProps {
  /** 감정 레이어 (최대 3개) */
  layers: EmotionLayer[];
  /** 카드에 표시할 감정명 (영문, ex: "ECSTASY") */
  emotionLabel: string;
  /** 카드 너비 (px) */
  width: number;
  /** 카드 높이 (px) */
  height: number;
  /** 추가 클래스 */
  className?: string;
}

/** EmotionCardBack (뒷면) Props */
export interface EmotionCardBackProps {
  /** 카드 렌더링 데이터 */
  data: EmotionCardData;
  /** 감정 레이어 (배경 브러시용) */
  layers: EmotionLayer[];
  /** 카드에 표시할 감정명 (영문) */
  emotionLabel: string;
  /** 카드 너비 (px) */
  width: number;
  /** 카드 높이 (px) */
  height: number;
  /** 추가 클래스 */
  className?: string;
}

/** EmotionBrush (브러시 SVG) Props */
export interface EmotionBrushProps {
  /** 감정 타입 (브러시 형태 결정) */
  emotionType: EmotionType;
  /** 브러시 색상 (hex) */
  color: string;
  /** opacity (0~1) */
  opacity: number;
  /** blur (px) */
  blur: number;
  /** 브러시 크기 (px, default: 400) */
  size?: number;
  /** 추가 클래스 */
  className?: string;
}

/** EmotionCardLabel (감정명 라벨) Props */
export interface EmotionCardLabelProps {
  /** 표시할 텍스트 (영문 감정명) */
  label: string;
  /** 위치: 좌상단 or 우하단(180° 회전) */
  position: 'top-left' | 'bottom-right';
  /** 추가 클래스 */
  className?: string;
}
